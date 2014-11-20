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
        var ctx = document.getElementById("terraincanvas").getContext("2d");
        var textureMap = {};

        return {
			tiles: [],
            init: function(callback) {
                var tileTypes = [
                    'grass',
                    'wall'
                ];

                for (var i = 0; i < tileTypes.length; i++) {
                    var img = new Image();
                    img.src = "gfx/tiles/"+ tileTypes[i] + ".png";
                    textureMap[i] = img;
                    if (i == tileTypes.length-1) {
                        img.onload = callback;
                    }
                }

                this.resize();
            },
            draw: function() {
                console.log("Drawing tiles...");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.fillStyle = "black";
                ctx.fill();

                for (var i = 0; i < this.tiles.length; i++) {
                    var tile = this.tiles[i];
                    if (hud.isDebugMode()) {
                        ctx.drawImage(textureMap[tile.type], tile.x*TILE_SIZE, tile.y*TILE_SIZE, TILE_SIZE-1, TILE_SIZE-1);
                    } else {
                        ctx.drawImage(textureMap[tile.type], tile.x*TILE_SIZE, tile.y*TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            },
            resize: function() {
                TILE_SIZE = config.getTileSize();
                ctx.canvas.width  = window.innerWidth;
                ctx.canvas.height = window.innerHeight;
				this.draw();
            }
        }
    }
);