
define(function() {
    var TILE_SIZE = 144;
    var ctx = document.getElementById("soundcanvas").getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var animatingSounds = [];

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 500);
            };
    })();

    function drawSounds(sounds) {
        console.log("Drawing sounds...");

        for (var i = 0; i < sounds.length; i++) {
            var sound = sounds[i];
            var radius = 10+sound.accuracy;
            var x = sound.x * TILE_SIZE - radius;
            var y = sound.y * TILE_SIZE - radius;
            var opacity = 0.1;

            var animatingSound = {
                x: x,
                y: y,
                startRadius: radius,
                currentRadius: radius,
                opacity: opacity,
                startNoise: sound.noise,
                currentNoise: sound.noise
            };
            animatingSounds.push(animatingSound);

            drawSound(animatingSound);
        }

        // wait one second before starting animation
        setTimeout(function() {
            animate();
        }, 500);
    }

    function drawSound(sound) {
        ctx.beginPath();
        ctx.arc(sound.x, sound.y, sound.currentRadius, 0, 2 * Math.PI, false);
        ctx.lineWidth = sound.currentNoise;
        ctx.strokeStyle = "rgba(255, 255, 255, "+sound.opacity+")";
        ctx.stroke();
    }

    function animate() {
        for (var i = 0; i < animatingSounds.length; i++) {
            var sound = animatingSounds[i];

            // pixels / second
            var newRadius = sound.currentRadius + 10; //(linearSpeed * time / 100);
            var newNoise = sound.currentNoise - 1; //(linearSpeed * time / 1000);

            if (newNoise >= 0) {
                sound.currentRadius = newRadius;
                sound.currentNoise = newNoise;
            } else {
                sound.currentRadius = sound.startRadius;
                sound.currentNoise = sound.startNoise;
            }
        }

        // clear
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (var i = 0; i < animatingSounds.length; i++) {
            sound = animatingSounds[i];
            if (sound.currentNoise > 0) {
                drawSound(sound);
            }
        }

        // request new frame
        requestAnimFrame(function() {
            animate();
        });
    }

    return {
        init: function(callback) {
            var itemTypes = [
                'box1.png'
            ];

            for (var i = 0; i < itemTypes.length; i++) {
                var img = new Image();
                img.src = "gfx/items/"+ itemTypes[i];
                textureMap[itemTypes[i]] = img;
                if (i == itemTypes.length-1) {
                    img.onload = callback;
                }
            }

            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        },
        draw: function(sounds) {
            drawSounds(sounds);
        }
    }
});