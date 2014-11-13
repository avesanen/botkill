/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function() {
        var TILE_SIZE = 144;
        var PLAYER_SIZE = 50;
        var img = new Image();
        img.src = "gfx/player.png";

        var ctx = document.getElementById("playercanvas").getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        function findAngle(v1, v2) {
            var angle1 = Math.atan2(-v1.y, -v1.x);
            var angle2 = Math.atan2(-v2.y, v2.x);
            return angle1-angle2;
        }

        return {
            draw: function(players) {
                console.log("Drawing players...");

                for (i = 0; i < players.length; i++) {
                    var player = players[i];
                    var x = player.x * TILE_SIZE - PLAYER_SIZE/2;
                    var y = player.y * TILE_SIZE - PLAYER_SIZE/2;

                    // Calculate the angle between vectors 0,-1 and player velocity
                    var v1 = {x:0, y:-1};
                    var angle = findAngle(v1, player.velocity); // TODO: Should use looking direction instead of velocity
                    console.log(angle);
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(angle);
                    ctx.drawImage(img, -PLAYER_SIZE/2, -PLAYER_SIZE/2);
                    ctx.restore();

                    ctx.font = 'bold 20px Courier';
                    ctx.fillStyle = 'black';
                    ctx.fillText(player.name, x - ctx.measureText(player.name).width/2, y - PLAYER_SIZE/2 - 20);
                }
            }
        }
    }
);