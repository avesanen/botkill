/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:13
 * To change this template use File | Settings | File Templates.
 */
define(function() {
        var TILE_SIZE = 144;
        var ctx = document.getElementById("aircanvas").getContext("2d");
        var textureMap = {};

        function drawItems(items) {
            console.log("Drawing items...");

            for (i = 0; i < items.length; i++) {
                var item = items[i];
                var width = textureMap[item.type].width;
                var height = textureMap[item.type].height;
                ctx.shadowColor = '#101010';
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 10;
                ctx.shadowOffsetY = 10;
                ctx.drawImage(textureMap[item.type], item.x*TILE_SIZE-width/2, item.y*TILE_SIZE-height/2);
            }
        }

        function drawSounds(sounds) {

        }

        function drawBullets(bullets) {

        }

        return {
            init: function(callback) {
                var itemTypes = [
                    'box1.png'
                ];

                for (i = 0; i < itemTypes.length; i++) {
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
                drawSounds(sounds);
                drawBullets(bullets);
            }
        }
    }
);