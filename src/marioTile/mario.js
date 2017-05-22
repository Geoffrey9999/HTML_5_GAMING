window.onload = function() {

    var game = new Phaser.Game(800, 450, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.load.tilemap('level1', 'src/marioTile/collide1.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('map1', 'src/marioTile/super_mario.png');
        game.load.image('map2', 'src/marioTile/SuperMarioBros-World1-1.png');
        game.load.spritesheet('mario', 'src/marioTile/mario_wjlfy5.png', 16, 16);
    }

    var map;
    var tileset;
    var layer;
    var player;
    var facing = 'right';
    var jumpTimer = 0;
    var cursors;
    var jumpButton;

    function create() {

        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#787878';

        map = game.add.tilemap('level1');

        map.addTilesetImage('super_mario', 'map1');
        map.addTilesetImage('SuperMarioBros-World1-1', 'map2');

        layer = map.createLayer('world1');
        layer = map.createLayer('collides');

        layer.map.setCollision([14, 15, 20, 21, 22, 27, 28,833, 834, 2010 ,2011, 2031, 2583, 2628, 2646, 2723 ], true, layer);

        layer.debug = true;

        layer.resizeWorld();

        game.physics.arcade.gravity.y = 110;

        player = game.add.sprite(16, game.world.height - 48, 'mario');
        game.physics.arcade.enable(player);
        player.body.gravity.y = 370;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [1, 2, 3], 10, true);
        player.animations.add('left', [8, 9, 10], 10, true);
        // player.goesRight = true;

        game.camera.follow(player);

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    }

    function update() {

        game.physics.arcade.collide(player, layer);

        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -150;

            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 150;

            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }
        }
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();

                if (facing == 'left')
                {
                    player.frame = 10;
                }
                else
                {
                    player.frame = 0;
                }

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
        {
            player.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }

    }

    function render () {

        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        // game.debug.bodyInfo(player, 3, 400);

    }
}
