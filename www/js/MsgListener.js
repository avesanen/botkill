/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 13.11.2014
 * Time: 1:18
 * To change this template use File | Settings | File Templates.
 */
define(['./TerrainCanvas', './PlayerCanvas', './AirCanvas', './FovCanvas', './SoundCanvas', './HudCanvas'], function(terrain, players, air, fov, sound, hud) {
        var messageHistory = [];
        var lastDrawn;

        function currentFrameIsLatest() {
            return messageHistory.length == hud.getCurrentFrame();
        }

        window.requestAnimFrame = (function(callback) {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
                function(callback) {
                    window.setTimeout(callback, 1000/60);
                };
        })();

        return {
            getHistorySize: function() { return messageHistory.length; },
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

                // Save for pause and playback
                messageHistory.push(data);
                if (!hud.isPaused()) {
                    hud.setCurrentFrame(messageHistory.length);
                    if (currentFrameIsLatest()) {
                        this.draw(hud.getCurrentFrame());
                    }
                }
            },
            draw: function(frame) {
                console.log("Draw frame " + frame);
                var data = messageHistory[frame-1];
                if (data.tiles != undefined && data.tiles.length > 0) {
                    terrain.draw(data.tiles);
                }
                players.draw(data.players);
                air.draw(data.items, data.sounds, data.bullets);
                fov.draw(data.players);
                sound.draw(data.sounds);
                lastDrawn = (new Date()).getTime();

                var that = this;
                if (!hud.isPaused() && !currentFrameIsLatest()) {
                    requestAnimFrame(function() {
                        hud.setCurrentFrame(hud.getCurrentFrame()+1);
                        that.draw(hud.getCurrentFrame());
                    });
                }
            },
            resize: function() {
                terrain.resize();
                players.resize();
                air.resize();
                fov.resize();
                sound.resize();
                hud.resize();
            }
        }
    }
);