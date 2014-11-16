
define(function(require) {
    var TILE_SIZE = require("config").TILE_SIZE;
    var TIMES_TO_SIGNAL = 3;
    var SOUND_SPEED = 3; // units per second
    var SOUND_START_LINE_WIDTH = 1; // 1 unit

    var ctx = document.getElementById("soundcanvas").getContext("2d");
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    var animatingSounds = [];

    window.requestAnimFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000/60);
            };
    })();

    function drawSounds(sounds) {
        console.log("Drawing sounds...");

        for (var i = 0; i < sounds.length; i++) {
            var sound = sounds[i];
            var x = sound.x * TILE_SIZE;
            var y = sound.y * TILE_SIZE;
            var opacity = 0.18;

            var animatingSound = {
                x: x,
                y: y,
                startRadius: 0,
                currentRadius: 0,
                lineWidth: SOUND_START_LINE_WIDTH,
                opacity: opacity,
                noise: sound.noise,
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
        ctx.arc(sound.x, sound.y, sound.currentRadius*TILE_SIZE, 0, 2 * Math.PI, false);
        ctx.lineWidth = sound.lineWidth * TILE_SIZE;
        ctx.strokeStyle = "rgba(255, 0, 0, "+sound.opacity+")";
        ctx.stroke();
    }

    function animate() {
        var expiredIndices = [];

        for (var i = 0; i < animatingSounds.length; i++) {
            var sound = animatingSounds[i];

            // pixels / second
            var deltatime = (new Date()).getTime() - sound.startTime;
            sound.startTime = (new Date()).getTime();
            var radiusToIncreasePerMilli = SOUND_SPEED / 1000;
            // So that line width gets to zero when radius (/2) reaches 1/10 units of sound noise's in one millisecond (/1000)
            var secondsToReachMaxDiameter = sound.noise / 10 / SOUND_SPEED;
            var secondsToReachMaxRadius = secondsToReachMaxDiameter / 2;
            var millisToReachMaxRadius = secondsToReachMaxRadius * 1000;

            var newRadius = deltatime * radiusToIncreasePerMilli;
            var newLineWidth = deltatime * SOUND_START_LINE_WIDTH / millisToReachMaxRadius;

            if (sound.lineWidth - newLineWidth >= 0) {
                sound.currentRadius += newRadius;
                sound.lineWidth -= newLineWidth;
            } else if (sound.iterations < TIMES_TO_SIGNAL) {
                sound.currentRadius = sound.startRadius;
                sound.lineWidth = 1;
                sound.iterations++;
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