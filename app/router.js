'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    router.get('/game/launch', controller.game.launch);
    router.get('/game/join', controller.game.join);
    router.get('/game/start', controller.game.start);
    router.get('/game/show', controller.game.show);
    router.get('/game/select', controller.game.select);
    router.post('/game/do', controller.game.do);
};
