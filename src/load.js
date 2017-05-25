var loadState = {

    preload: function() {

        //LEVEL 1
        game.load.tilemap('level1', 'assets/games/Mario/world1/world1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('map1', 'assets/games/Mario/world1/super_mario.png');
        game.load.image('map2', 'assets/games/Mario/world1/SuperMarioBros-World1-1.png');
        game.load.spritesheet('mario', 'assets/games/Mario/sprite/mario_wjlfy5.png', 16, 16);
        game.load.spritesheet('goomba_png', 'assets/games/Mario/ennemies/gombas.png', 16, 16);
        game.load.spritesheet('coin_png', 'assets/games/Mario/events/coins.png', 16, 16);

        //BOSS 1
        game.load.tilemap('boss1', 'assets/games/Mario/boss1/boss1.json', null, Phaser.Tilemap.TILED_JSON );
        game.load.image('castle_png', 'assets/games/Mario/boss1/bowsers-castle.gif');
        game.load.spritesheet('bowser', 'assets/games/Mario/sprite/bowsers.png', 48, 58);
        game.load.spritesheet('flame', 'assets/games/Mario/boss1/flame.gif', 34, 34);
    },

    create: function() {
        game.state.start('level1');
    },

}
