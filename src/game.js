var game = new Phaser.Game(800, 450, Phaser.CANVAS, 'Mario');

game.state.add("boot", bootState);
game.state.add('load', loadState);
game.state.add("level1", level1);

game.state.start("boot");
