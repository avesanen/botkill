/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function(require) {
        var TILE_SIZE = require("config").TILE_SIZE;

        var ctx = document.getElementById("terraincanvas").getContext("2d");
        var textureMap = {};

        return {
            ready: false,
            init: function(callback) {
                var tileTypes = [
                    'grass',
                    'wall'
                ];

                for (i = 0; i < tileTypes.length; i++) {
                    var img = new Image();
                    img.src = "gfx/tiles/"+ tileTypes[i] + ".png";
                    textureMap[i] = img;
                    if (i == tileTypes.length-1) {
                        img.onload = callback;
                    }
                }

                ctx.canvas.width  = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
            },
            draw: function(tiles) {
                console.log("Drawing tiles...");

                for (i = 0; i < tiles.length; i++) {
                    var tile = tiles[i];
                    ctx.drawImage(textureMap[tile.type], tile.x*TILE_SIZE, tile.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
                ready = true;
            }
        }
    }
);