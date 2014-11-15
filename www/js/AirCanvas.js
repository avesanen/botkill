/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function(require) {
        var TILE_SIZE = require("config").TILE_SIZE;
        var ctx = document.getElementById("aircanvas").getContext("2d");
        var textureMap = {};

        function drawItems(items) {
            console.log("Drawing items...");

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var width = TILE_SIZE * item.size;
                var height = TILE_SIZE * item.size;
                ctx.shadowColor = '#101010';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 10;
                ctx.drawImage(textureMap[item.type], item.x*TILE_SIZE-width/2, item.y*TILE_SIZE-height/2, width, height);
            }
        }

        function drawBullets(bullets) {
            console.log("Drawing bullets...");
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
            draw: function(items, sounds, bullets) {
                drawItems(items);
                drawBullets(bullets);
            }
        }
    }
);