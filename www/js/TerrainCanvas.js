/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function() {
        var TILE_SIZE = 144;

        var tileTypes = [
            'grass',
            'wall',
            'box1'
        ];

        var textureMap = {};
        for (i = 0; i < tileTypes.length; i++) {
            var img = new Image();
            img.src = "gfx/tiles/"+ tileTypes[i] + ".png";
            textureMap[i] = img;
        }

        var ctx = document.getElementById("terraincanvas").getContext("2d");
        ctx.canvas.width  = window.innerWidth;
        ctx.canvas.height = window.innerHeight;

        return {
            draw: function(tiles) {
                console.log("Drawing tiles...");

                for (i = 0; i < tiles.length; i++) {
                    var tile = tiles[i];
                    ctx.drawImage(textureMap[tile.type], tile.x*TILE_SIZE, tile.y*TILE_SIZE);
                }
            }
        }
    }
);