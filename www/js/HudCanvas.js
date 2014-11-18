define(function(require) {
        var config = require("config");
        var TILE_SIZE = config.getTileSize();
        var ctx = document.getElementById("hudcanvas").getContext("2d");
        var textureMap = {};
		var DEBUG_ON = 0, DEBUG_OFF = 1,
            PLAY = 2, PAUSE = 3;

        var msgListener;
        var mockData; // TODO: Remove when server available

        var debugMode = true;
        var paused = false;
        var currentFrame = 0;

        var scrollBar = {};
        var scrollFinder;

		var hudItems = [
            "debugModeOn",
            "debugModeOff",
            "play",
            "pause"
		];
				
		function getMousePos(evt) {
			var rect = ctx.canvas.getBoundingClientRect();
			return {
				x: evt.clientX - rect.left,
				y: evt.clientY - rect.top
			};
		}
	  
        function drawHud() {
            console.log("Drawing HUD...");
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            // Debug mode toggle
			var img = debugMode ? textureMap[DEBUG_ON] : textureMap[DEBUG_OFF];
			var x = 10;
			var y = ctx.canvas.height - img.elem.height - 10;
			img.x = x;
			img.y = y;
			img.click = toggleDebugMode;
			ctx.drawImage(img.elem, img.x, img.y, img.elem.width, img.elem.height);
            ctx.font = 'normal 12px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText("Debug mode", x, y - 5);

            x += img.elem.width;

            // Play/Pause buttons
            img = paused ? textureMap[PLAY] : textureMap[PAUSE];
            x += 30;
            y = ctx.canvas.height - img.elem.height - 10;
            img.x = x;
            img.y = y;
            img.click = togglePause;
            ctx.drawImage(img.elem, img.x, img.y, img.elem.width, img.elem.height);

            x += img.elem.width;

            // Scroll bar
            x += 20;
            scrollBar.width = config.tilesXCount*config.getTileSize() - x;
            scrollBar.height = 2;
            y = ctx.canvas.height - img.elem.height/2 - 10;
            scrollBar.x = x;
            scrollBar.y = y;
            scrollBar.click = jumpTo;
            ctx.beginPath();
            ctx.moveTo(scrollBar.x, scrollBar.y);
            ctx.lineTo(scrollBar.x + scrollBar.width, scrollBar.y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();

            if (scrollFinder == undefined) {
                scrollFinder = {};
                scrollFinder.width = 15;
                scrollFinder.height = 15;
                y = ctx.canvas.height - img.elem.height/2 - 9;
                scrollFinder.x = x;
                scrollFinder.y = y;
                scrollFinder.mousedown = moveFinder;
            }
            ctx.beginPath();
            ctx.arc(scrollFinder.x, scrollFinder.y, scrollFinder.width/2, 0, 2 * Math.PI, false);
            ctx.fillStyle = "rgba(200, 0, 0, 1)";
            ctx.fill();
        }

        var toggleDebugMode = function() {
            console.log("Debug mode " + !debugMode + "...");
            debugMode = !debugMode;
            drawHud();
            msgListener.draw(currentFrame); // TODO: remove when server available
        }
        var pause = function() {
            paused = true;
            drawHud();
        }
        var togglePause = function() {
            paused = !paused;
            drawHud();

            if (paused) {
                console.log("Paused...");
            } else {
                console.log("Resuming...");
                msgListener.draw(currentFrame);
            }
        }
        var jumpTo = function(x) {
            currentFrame = Math.ceil(x / (scrollBar.width / msgListener.getHistorySize()));

            console.log("Jumping to frame: " + currentFrame);

            scrollFinder.x = scrollBar.x + scrollBar.width / msgListener.getHistorySize() * (currentFrame-1);
            drawHud();
            msgListener.draw(currentFrame);
        }
        var moveFinder = function(x) {
            scrollFinder.x = x;
            scrollFinder.x = Math.max(scrollFinder.x, scrollBar.x);
            scrollFinder.x = Math.min(scrollFinder.x, scrollBar.x + scrollBar.width);
            currentFrame = Math.ceil(scrollFinder.x / (scrollBar.width / msgListener.getHistorySize()));
            drawHud();
            console.log(currentFrame);
            msgListener.draw(currentFrame);
        }

        return {
            isDebugMode: function() { return debugMode; },
            isPaused: function() { return paused; },
            setCurrentFrame: function(frame) {
                currentFrame = frame;
                scrollFinder.x = scrollBar.x + scrollBar.width / msgListener.getHistorySize() * (currentFrame-1);
                drawHud();
            },
            getCurrentFrame: function() { return currentFrame; },

            init: function(callback) {
				ctx.canvas.addEventListener('click', function(evt) {
					var mousePos = getMousePos(evt);

                    // Special check for record playback scroll bar
                    if (mousePos.y > scrollBar.y - 3 && mousePos.y < scrollBar.y + scrollBar.height + 3 && mousePos.x > scrollBar.x && mousePos.x < scrollBar.x + scrollBar.width) {
                        // Pass x coordinate relative to scroll bar
                        scrollBar.click(mousePos.x - scrollBar.x);
                        return;
                    }

					for (var key in textureMap) {
						if (textureMap.hasOwnProperty(key)) {
							var img = textureMap[key];
                            if (mousePos.y > img.y && mousePos.y < img.y + img.elem.height && mousePos.x > img.x && mousePos.x < img.x + img.elem.width) {
                                img.click();
                                return;
                            }
						}
					};
				}, false);

                ctx.canvas.addEventListener('mousedown', function(evt) {
                    var mousePos = getMousePos(evt);
                    if (mousePos.y > scrollFinder.y - 3 && mousePos.y < scrollFinder.y + scrollFinder.height + 3 && mousePos.x > scrollFinder.x && mousePos.x < scrollFinder.x + scrollFinder.width) {
                        scrollFinder.clicked = true;
                        pause();
                    }
                }, false);
                ctx.canvas.addEventListener('mouseup', function(evt) {
                    if (scrollFinder.clicked) {
                        scrollFinder.clicked = false;
                    }
                }, false);
                ctx.canvas.addEventListener('mousemove', function(evt) {
                    if (scrollFinder.clicked) {
                        paused = true;
                        var mousePos = getMousePos(evt);
                        moveFinder(mousePos.x);
                    }
                }, false);

                for (var i = 0; i < hudItems.length; i++) {
                    var elem = new Image();
                    elem.src = "gfx/hud/"+ hudItems[i]+".png";
					var img = {};
					img.elem = elem;
					textureMap[i] = img;
                    if (i == hudItems.length-1) {
                        img.elem.onload = callback;
                    }
                }

                this.resize();
            },
            draw: function() {
                drawHud();
            },
            resize: function() {
                TILE_SIZE = config.getTileSize();
                ctx.canvas.width  = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
                this.draw();
            },
            // TODO: Remove when server available
            setMockData: function(listener, d) {
                msgListener = listener;
                mockData = d;
            }
        }
    }
);