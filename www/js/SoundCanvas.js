
define(function() {
    var TILE_SIZE = 144;
    var ctx = document.getElementById("soundcanvas").getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var animatingSounds = [];

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
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
                currentNoise: sound.noise,
                iterations: 1,
                startTime: (new Date()).getTime()
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
        var expiredIndices = [];

        for (var i = 0; i < animatingSounds.length; i++) {
            var sound = animatingSounds[i];

            // pixels / second
            var time = (new Date()).getTime() - sound.startTime;
            var newRadius = 5 * time / 1000;
            var newNoise = time / 1000;

            if (sound.currentNoise - newNoise >= 0) {
                sound.currentRadius += newRadius;
                sound.currentNoise -= newNoise;
            } else if (sound.iterations < 3) {
                sound.currentRadius = sound.startRadius;
                sound.currentNoise = sound.startNoise;
                sound.iterations++;
                sound.startTime = (new Date()).getTime();
            } else {
                expiredIndices.push(i);
            }
        }

        // clear
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Remove animating sounds that have signaled enough times
        for (var i = 0; i < expiredIndices.length; i++) {
            animatingSounds.splice(expiredIndices[i], 1);
        }

        // Draw the sound with its new properties
        for (var i = 0; i < animatingSounds.length; i++) {
            sound = animatingSounds[i];
            drawSound(sound);
        }

        // If there's still something to animate
        if (animatingSounds.length > 0) {
            requestAnimFrame(function() {
                animate();
            });
        }
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