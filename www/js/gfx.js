/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 12.11.2014
 * Time: 23:26
 * To change this template use File | Settings | File Templates.
 */
define(['jquery','exports'], function ($,exports) {
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    var mapCanvas = $("#mapCanvas")[0];
    var mapCtx = mapCanvas.getContext('2d');

    exports.clear = function() {
        // It's a hack, but it's a good hack.
        canvas.width = canvas.width;
    };

    /**
     * Draw a sprite to some canvas or the main canvas if none specified
     * @param sprite The sprite object to draw
     * @param useMapCanvas Optional parameter. If true, draw to map canvas instead.
     */
    exports.drawSprite = function(sprite, useMapCanvas) {
        var drawCtx;
        if (useMapCanvas) {
            drawCtx = mapCtx;
        } else {
            drawCtx = ctx;
        }
        drawCtx.translate(sprite.x, sprite.y);
        drawCtx.rotate(sprite.angle);
        drawCtx.drawImage(sprite.img, -sprite.width / 2, -sprite.height / 2, sprite.width, sprite.height);
        drawCtx.rotate(-sprite.angle);
        drawCtx.translate(-sprite.x, -sprite.y);
    };

    /**
     * Draw the map canvas to main canvas
     * @param xScroll
     * @param yScroll
     */
    exports.drawMap = function(xScroll, yScroll) {
        ctx.drawImage(mapCanvas, -xScroll, -yScroll);
    };
    /**
     * Get collision value from the map canvas at specific coords
     * Used for bullet/ship <-> map collision detection
     * @param x
     * @param y
     * @returns true or false
     */
    exports.getMapCollision = function(x, y) {
        pixel = mapCtx.getImageData(x, y, 1, 1);
        // data has 4 indexes - R, G, B, A
        //console.log('RGBA = '+pixel.data[0]+', '+pixel.data[1]+', '+pixel.data[2]+', '+pixel.data[3]);
        // If pixel is not transparent and it's not black then it is wall
        if ((pixel.data[3]>0) && ((pixel.data[2]>0) || (pixel.data[1]>0) || (pixel.data[0]>0)))
            return true;
        else
            return false;
    };
});