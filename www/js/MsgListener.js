/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:18
 * To change this template use File | Settings | File Templates.
 */
define(['./TerrainCanvas', './PlayerCanvas', './AirCanvas', './FovCanvas', './SoundCanvas'], function(terrain, players, air, fov, sound) {
        return {
            init: function(callback) {
                terrain.init(function() {
                    air.init(function() {
                        players.init(function() {
                            callback();
                        });
                    });
                });
            },
            handle: function(msg) {
                var data = JSON.parse(msg);
                if (!terrain.ready) {
                    terrain.draw(data.tiles);
                }
                players.draw(data.players);
                air.draw(data.items, data.sounds, data.bullets);
                fov.draw(data.players);
                sound.draw(data.sounds);
            }
        }
    }
);