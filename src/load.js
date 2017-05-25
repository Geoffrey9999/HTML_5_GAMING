var loadState = {

    preload: function() {

        //MAIN MENU
        game.load.image('mainTitle', 'assets/mainMenu/menu.jpg');
        game.load.spritesheet('button', 'assets/mainMenu/button.png', 200, 72);

        //LIFE
        game.load.spritesheet('life', 'assets/games/Mario/world1/super_mario.png', 16, 16);

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

        //SOUNDS
        game.load.audio('kick','assets/soundEffects/smb_kick.wav');
        game.load.audio('jump','assets/soundEffects/smb_jump-small.wav');
        game.load.audio('coin','assets/soundEffects/smb_coin.wav');
        game.load.audio('chat', 'assets/soundEffects/smas_chat.wav');
        game.load.audio('main','assets/soundEffects/main.mp3');
        game.load.audio('title', 'assets/soundEffects/title.mp3');
        game.load.audio('hit', 'assets/soundEffects/hit.wav');
    },

    create: function() {
        game.state.start('menu');
    },

}
