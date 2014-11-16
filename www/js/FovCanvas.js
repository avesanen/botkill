/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function(require) {
        var TILE_SIZE = require("config").TILE_SIZE;
        var PLAYER_SIZE = TILE_SIZE/2;
        var FOV = 70;
        var FOV_RAD = FOV*Math.PI/180;
        var DARKNESS = 0.6;
        var FOV_GRADIENT_AMOUNT = 7;

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
            // Arc angle 0 points to right so calculate the angle between vectors 1,0 and player velocity.
            var v1 = {x:1, y:0};
            var sight = player.sight/10*TILE_SIZE;
            var angle = findAngle(v1, player.velocity); // TODO: Should use looking direction instead of velocity
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);

            // create a linear gradient
            var grd = ctx.createLinearGradient(0, 0, sight, 0);
            grd.addColorStop(0, 'rgba(0,0,0,'+0.1+')');
            grd.addColorStop(1, 'rgba(0,0,0,'+DARKNESS/FOV_GRADIENT_AMOUNT+')');

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, sight, -FOV_RAD/2, FOV_RAD/2, false);

            // set clipping mask based on shape
            ctx.clip();

            // clear anything inside it. Take translate into account.
            ctx.clearRect(-x-sight, -y-sight, ctx.canvas.width+sight, ctx.canvas.height+sight);

            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, sight, -FOV_RAD/2, FOV_RAD/2, false);
            ctx.fillStyle = grd;
            ctx.fill();
            var endRad = 2 + FOV_GRADIENT_AMOUNT/20;
            for (var i = 0; i < FOV_GRADIENT_AMOUNT; i++) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, sight, FOV_RAD/2, FOV_RAD/endRad, true);
                ctx.fillStyle = grd;
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, sight, -FOV_RAD/2, -FOV_RAD/endRad, false);
                ctx.fillStyle = grd;
                ctx.fill();
                endRad += FOV_GRADIENT_AMOUNT/20;
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