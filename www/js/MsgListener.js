/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:18
 * To change this template use File | Settings | File Templates.
 */
define(['./TerrainCanvas', './PlayerCanvas'], function(terrain, players) {
        return {
            init: function(callback) {
                terrain.init(function() {
                    players.init(function() {
                        callback();
                    });
                });
            },
            handle: function(msg) {
                var data = JSON.parse(msg);
                terrain.draw(data.tiles);
                players.draw(data.players);
            }
        }
    }
);