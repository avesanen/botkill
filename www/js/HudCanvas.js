define(function() {
        var ctx = document.getElementById("hudcanvas").getContext("2d");
        var textureMap = {};
		var HIGH_QUALITY = "highQuality";
		var DEBUG_QUALITY = "debugQuality";
		var hudItems = [
			{name:HIGH_QUALITY, onclick:'highQuality'}
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

			var img = textureMap[HIGH_QUALITY];
			var x = ctx.canvas.width - img.elem.width - 10;
			var y = 10;
			img.x = x;
			img.y = y;
			img.click = highQuality;
			ctx.drawImage(img.elem, img.x, img.y, img.elem.width, img.elem.height);
        }

        var highQuality = function highQuality() {
            console.log("High graphics quality ON...");
        }
		function debugQuality() {
			console.log("Debug graphics quality ON...");
		}

        return {
            init: function(callback) {
				ctx.canvas.addEventListener('click', function(evt) {
					var mousePos = getMousePos(evt);
					for (var key in textureMap) {
						if (textureMap.hasOwnProperty(key)) {
							var img = textureMap[key];
							if (mousePos.y > img.y && mousePos.y < img.y + img.elem.height && mousePos.x > img.x && mousePos.x < img.x + img.elem.width) {
								img.click();
							}
						}
					};
				}, false);

                for (var i = 0; i < hudItems.length; i++) {
                    var elem = new Image();
                    elem.src = "gfx/hud/"+ hudItems[i].name+".png";
					var img = {};
					img.elem = elem;
					textureMap[hudItems[i].name] = img;
                    if (i == hudItems.length-1) {
                        img.elem.onload = callback;
                    }
                }

                ctx.canvas.width  = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
            },
            draw: function() {
                drawHud();
            }
        }
    }
);