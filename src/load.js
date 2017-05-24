var loadState = {

    preload: function() {
        game.load.tilemap('level1', 'assets/games/Mario/world1/world1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('map1', 'assets/games/Mario/world1/super_mario.png');
        game.load.image('map2', 'assets/games/Mario/world1/SuperMarioBros-World1-1.png');
        game.load.spritesheet('mario', 'assets/games/Mario/sprite/mario_wjlfy5.png', 16, 16);
        game.load.spritesheet('goomba_png', 'assets/games/Mario/ennemies/gombas.png', 16, 16);
        game.load.spritesheet('coin_png', 'assets/games/Mario/events/coins.png', 16, 16);
    },

    create: function() {
        game.state.start('level1');
    },

}
