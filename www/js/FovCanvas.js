/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function(require) {
        var config = require("config");
        var TILE_SIZE = config.getTileSize();
        var hud = require("HudCanvas");

        var FOV = 70;
        var DARKNESS = 0.6;
        var FOV_GRADIENT_AMOUNT = 9;
        var GRADIENT_PERCENT_OF_FOV = 0.5;
        var colors = ['0,0,0', '255,0,0', '0,255,0', '0,0,255'];

        var ctx = document.getElementById("fovcanvas").getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        var lightData = {data:[]};

        function findAngle(v1, v2) {
            var angle1 = Math.atan2(-v1.y, v1.x);
            var angle2 = Math.atan2(-v2.y, v2.x);
            return angle1-angle2;
        }

        function drawDarkness() {
            for (var n = 3; n < lightData.data.length; n += 4) {
                if (lightData.data[n] == 0) {
                    lightData.data[n] = 255*DARKNESS;
                }
            }
        }

        function drawPlayerFov(player, x, y) {
            // Increase FOV by 50% of the player's sight. E.g. sight of 90 would increase FOV by 45 degrees.
            var FOV_RAD = (FOV + player.sight/2)*Math.PI/180;
            var sight = player.sight/10*TILE_SIZE;
            // Arc angle 0 points to right so calculate the angle between vectors 1,0 and player looking direction.
            var v1 = {x:1, y:0};
            var angle = findAngle(v1, player.velocity); // TODO: Should use looking direction instead of velocity

            if (!hud.isDebugMode()) {
                // Clear all beams drawn before
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            }

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            if (hud.isDebugMode()) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, sight, -FOV_RAD/2, FOV_RAD/2, false);
                ctx.closePath();
                ctx.fillStyle = "rgba("+colors[player.team]+", 0.05)";
                ctx.strokeStyle = "rgba(0,0,0,0.5)";
                ctx.stroke();
                ctx.closePath();
                ctx.fill();
            } else {
                // create a linear gradient
                var grd = ctx.createLinearGradient(0, 0, sight, 0);
                grd.addColorStop(0, 'rgba(0,0,0,'+0.0+')');
                grd.addColorStop(1, 'rgba(0,0,0,'+DARKNESS+')');

                // Draw clipping area arc. This will be clipped off from the darkness
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, sight, -FOV_RAD/2, FOV_RAD/2, false);

                // Put a gradient inside clipped area so that it blends smoothly
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, sight*1.1, -FOV_RAD/2*(1-GRADIENT_PERCENT_OF_FOV), FOV_RAD/2*(1-GRADIENT_PERCENT_OF_FOV), false);
                ctx.fillStyle = grd;
                ctx.fill();

                // Draw extra arcs with gradients on the both edges of the arc to smooth out the edges as well
                var startRad = FOV_RAD/2;
                var endRad = startRad - FOV_RAD/2 * GRADIENT_PERCENT_OF_FOV/FOV_GRADIENT_AMOUNT;

                var gradientDarkness = DARKNESS - DARKNESS/(FOV_GRADIENT_AMOUNT+1);
                for (var i = 0; i < FOV_GRADIENT_AMOUNT; i++) {
                    var grd2 = ctx.createLinearGradient(0, 0, sight, 0);
                    grd2.addColorStop(0, 'rgba(0,0,0,'+gradientDarkness+')');
                    grd2.addColorStop(1, 'rgba(0,0,0,'+DARKNESS+')');

                    // The right side
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.arc(0, 0, sight*1.1, startRad, endRad, true);
                    ctx.fillStyle = grd2;
                    ctx.fill();

                    // The left side
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.arc(0, 0, sight*1.1, -startRad, -endRad, false);
                    ctx.fillStyle = grd2;
                    ctx.fill();

                    // Move towards the center of the FOV arc
                    startRad = endRad;
                    endRad -= FOV_RAD/2 * GRADIENT_PERCENT_OF_FOV/FOV_GRADIENT_AMOUNT;
                    // Lessen the gradient darkness on each iteration
                    gradientDarkness -= DARKNESS/FOV_GRADIENT_AMOUNT;
                }
            }

            ctx.restore();

            if (!hud.isDebugMode()) {
                var imgData = ctx.getImageData(0,0,ctx.canvas.width,ctx.canvas.height);
                if (lightData.data.length > 0) {
                    for (var n = 3; n < imgData.data.length; n += 4) {
                        if (imgData.data[n] != 0 && lightData.data[n] != 0) {
                            lightData.data[n] = Math.max(1, Math.min(imgData.data[n], lightData.data[n] - (255 - imgData.data[n]*2)));
                        } else if (imgData.data[n] != 0) {
                            lightData.data[n] = imgData.data[n];
                        }
                    }
                } else {
                    lightData = imgData;
                }
            }
        }

        return {
            draw: function(players) {
                console.log("Drawing fovs...");

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                lightData = {data:[]};

                for (var i = 0; i < players.length; i++) {
                    var player = players[i];
                    var x = player.x * TILE_SIZE;
                    var y = player.y * TILE_SIZE;

                    drawPlayerFov(player, x, y);
                }

                if (!hud.isDebugMode()) {
                    drawDarkness();
                    ctx.putImageData(lightData, 0, 0);
                }
            },
            resize: function() {
                TILE_SIZE = config.getTileSize();
                ctx.canvas.width  = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
            }
        }
    }
);