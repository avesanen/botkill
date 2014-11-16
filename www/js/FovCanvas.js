/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function(require) {
        var TILE_SIZE = require("config").TILE_SIZE;
        var FOV = 70;
        var DARKNESS = 0.6;
        var FOV_GRADIENT_AMOUNT = 5;
        var GRADIENT_PERCENT_OF_FOV = 0.9;
        var colors = ['0,0,0', '255,0,0', '0,255,0', '0,0,255'];

        var ctx = document.getElementById("fovcanvas").getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        function findAngle(v1, v2) {
            var angle1 = Math.atan2(-v1.y, v1.x);
            var angle2 = Math.atan2(-v2.y, v2.x);
            return angle1-angle2;
        }

        function drawDarkness() {
            ctx.fillStyle = "rgba(0, 0, 0, "+DARKNESS+")";
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }

        function drawPlayerFov(player, x, y) {
//            var FOV_RAD = (FOV + player.sight/2)*Math.PI/180;
//            var sight = player.sight/10*TILE_SIZE;
//            var v1 = {x:1, y:0};
//            var angle = findAngle(v1, player.velocity); // TODO: Should use looking direction instead of velocity
//
//            ctx.save();
//            ctx.translate(x, y);
//            ctx.rotate(angle);
//            ctx.beginPath();
//            ctx.moveTo(0, 0);
//            ctx.arc(0, 0, sight, -FOV_RAD/2, FOV_RAD/2, false);
//            ctx.fillStyle = "rgba("+colors[player.team]+", 0.3)";
//            ctx.closePath();
//            ctx.fill();
//            ctx.restore();

            // Increase FOV by 50% of the player's sight. E.g. sight of 90 would increase FOV by 45 degrees.
            var FOV_RAD = (FOV + player.sight/2)*Math.PI/180;

            // Arc angle 0 points to right so calculate the angle between vectors 1,0 and player looking direction.
            var v1 = {x:1, y:0};
            var sight = player.sight/10*TILE_SIZE;
            var angle = findAngle(v1, player.velocity); // TODO: Should use looking direction instead of velocity
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // create a linear gradient
            var grd = ctx.createLinearGradient(0, 0, sight, 0);
            grd.addColorStop(0, 'rgba(0,0,0,'+0.0+')');
            grd.addColorStop(1, 'rgba(0,0,0,'+DARKNESS+')');

            // Draw clipping area arc. This will be clipped off from the darkness
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, sight, -FOV_RAD/2, FOV_RAD/2, false);
            ctx.clip();

            // clear anything inside it. Take translate into account.
            ctx.clearRect(-x-sight, -y-sight, ctx.canvas.width+sight, ctx.canvas.height+sight);

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

            ctx.restore();
        }

        return {
            draw: function(players) {
                console.log("Drawing fovs...");

                drawDarkness();

                for (i = 0; i < players.length; i++) {
                    var player = players[i];
                    var x = player.x * TILE_SIZE;
                    var y = player.y * TILE_SIZE;

                    drawPlayerFov(player, x, y);
                }
            }
        }
    }
);