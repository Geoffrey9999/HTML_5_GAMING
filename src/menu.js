var map;

MainMenu = {

    create: function() {
        game.sound.play('chat');
        game.sound.play('title', true);
        game.scale.pageAlignHorizontally = true;
        game.stage.backgroundColor = '#5c94fc';
        game.scale.pageAlignVertically = true
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var background = game.add.sprite(12, 12, 'mainTitle');
        background.scale.set(0.48, 0.35);

        button = game.add.button(280,  250, 'button', this.actionOnClick, this, 1, 2, 3);
    },

    actionOnClick: function() {
        game.sound.stopAll();
        game.state.start('level1');
    },
}
