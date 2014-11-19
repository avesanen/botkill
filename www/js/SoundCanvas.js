
define(function(require) {
    var hud = require("HudCanvas");
    var config = require("config");
    var TILE_SIZE = config.getTileSize();
    var TIMES_TO_SIGNAL = 1;
    var SOUND_ANIM_TIME = 1; // how long sound animation lasts in seconds
    var SOUND_START_LINE_WIDTH = 1; // 1 unit
    var START_OPACITY = 0.4;

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

            var animatingSound = {
                x: x,
                y: y,
                startRadius: sound.noise/10 / 2,
                currentRadius: sound.noise/10 / 2,
                lineWidth: 2,
                opacity: START_OPACITY,
                noise: 2,
                iterations: 1,
                lastAnimate: 0
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
        ctx.lineWidth = sound.lineWidth;
        ctx.strokeStyle = "rgba(255, 0, 0, "+sound.opacity+")";
        ctx.stroke();
    }

    function animate() {
        var expiredIndices = [];

        for (var i = 0; i < animatingSounds.length; i++) {
            var sound = animatingSounds[i];

            // If sound have not yet gone through a single animation frame
            if (sound.lastAnimate == 0) {
                sound.lastAnimate = (new Date()).getTime();
            }

            var deltatime = (new Date()).getTime() - sound.lastAnimate;
            sound.lastAnimate = (new Date()).getTime();
            var radiusToIncreasePerMilli = sound.noise/10 / 2 / SOUND_ANIM_TIME / 1000;
            var millisToReachMaxRadius = SOUND_ANIM_TIME * 1000;
            // -0.1 because I don't want the sound arc disappear totally.
            var opacityToDecreasePerMilli = (START_OPACITY - 0.1) / SOUND_ANIM_TIME / 1000;

            var newRadius = deltatime * radiusToIncreasePerMilli;
            var newLineWidth = deltatime * SOUND_START_LINE_WIDTH / millisToReachMaxRadius;
            var newOpacity = deltatime * opacityToDecreasePerMilli;

            if (sound.opacity - newOpacity >= 0) {
                //sound.currentRadius += newRadius;
                //sound.lineWidth -= newLineWidth;
                sound.opacity -= newOpacity;
            } else if (sound.iterations < TIMES_TO_SIGNAL) {
                sound.currentRadius = sound.startRadius;
                sound.lineWidth = 1;
                sound.opacity = START_OPACITY;
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

            this.resize();
        },
        draw: function(sounds) {
            drawSounds(sounds);
        },
        resize: function() {
            TILE_SIZE = config.getTileSize();
            ctx.canvas.width  = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        }
    }
});