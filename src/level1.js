var map;
var tileset;
var layer;
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;

var level1 = {

    create: function() {

        game.stage.backgroundColor = '#5c94fc';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        map = game.add.tilemap('level1');

        map.addTilesetImage('super_mario', 'map1');
        map.addTilesetImage('SuperMarioBros-World1-1', 'map2');
        map.addTilesetImage('tiles_dctsfk', 'goomba_png');
        map.addTilesetImage('tiles_dctsfk', 'coin_png');

        layer = map.createLayer('world1');
        layer = map.createLayer('collides');

        layer.map.setCollision([14, 15, 20, 21, 22, 27, 28,833, 834, 2010 ,2011, 2031, 2583, 2628, 2646, 2723], true, layer);
        layer.resizeWorld();

        // layer.debug = true;

        // HOLES
        holes = game.add.group();
        holes.enableBody = true;
        map.createFromObjects('end', 'hole', 0, 0, true, false , holes);
        holes.setAll('body.gravity', 0);

        // END MAP
        end = game.add.group();
        end.enableBody = true;
        map.createFromObjects('end', 'finish', 1, 0, true, false, end);
        end.setAll('body.gravity', 0);


        // COINS
        coins = game.add.group();
        coins.enableBody = true;
        map.createFromTiles(3226, null, 'coin_png', 'stuff', coins);
        coins.callAll('animations.add', 'animations', 'spin', [0, 0, 1, 2], 3, true);
        coins.callAll('animations.play', 'animations', 'spin');
        coins.setAll('body.gravity', 0);

        // GOMBAS
        goombas = game.add.group();
        goombas.enableBody = true;
        map.createFromTiles(3225, null, 'goomba_png', 'events', goombas);
        goombas.callAll('animations.add', 'animations', 'walk', [0, 1], 2, true);
        goombas.callAll('animations.play', 'animations', 'walk');
        goombas.setAll('body.bounce.x', 1);
        goombas.setAll('body.velocity.x', -20);
        goombas.setAll('body.gravity.y', 500);

        game.physics.arcade.gravity.y = 110;

        // MARIO
        player = game.add.sprite(16, game.world.height - 48, 'mario');
        game.physics.arcade.enable(player);
        player.body.gravity.y = 370;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [1, 2, 3], 10, true);
        player.animations.add('left', [8, 9, 10], 10, true);

        game.camera.follow(player);

        cursors = game.input.keyboard.createCursorKeys();

    },

    update: function() {

        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(goombas, layer);
        game.physics.arcade.collide(coins, layer);

        game.physics.arcade.overlap(player, goombas, this.goombaOverlap);
        game.physics.arcade.overlap(player, coins, this.coinOverlap);
        game.physics.arcade.overlap(player, holes, this.dead);
        game.physics.arcade.overlap(player, end, this.finishLine);

        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -150;

            if (facing != 'left'){
                player.animations.play('left');
                facing = 'left';
            }
        }
        else if (cursors.right.isDown) {
            player.body.velocity.x = 150;

            if (facing != 'right') {
                player.animations.play('right');
                facing = 'right';
            }
        } else {
            if (facing != 'idle') {
                player.animations.stop();

                if (facing == 'left') {
                    player.frame = 10;
                } else {
                    player.frame = 0;
                }

                facing = 'idle';
            }
        }

        if (cursors.up.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
            player.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }
    },

    coinOverlap: function(player, coin) {
        coin.kill();
    },

    goombaOverlap: function(player, goomba) {
        if (player.body.touching.down) {
            goomba.animations.stop();
            goomba.frame = 2;
            goomba.body.enable = false;
            player.body.velocity.y = -80;
            game.time.events.add(Phaser.Timer.SECOND, function() {
                goomba.kill();
            });
        } else {
            player.frame = 6;
            player.body.enable = false;
            player.animations.stop();
            game.time.events.add(Phaser.Timer.SECOND * 0, function() {
                game.paused = true;
            });
        }
    },

    dead: function(player, holes) {
        if (player.body.touching.down) {
            player.frame = 6;
            player.body.enable = false;
            player.animations.stop();
            game.time.events.add(Phaser.Timer.SECOND * 0, function() {
                game.paused = true;
            });
        }
    },

    finishLine: function(player, end) {
        game.state.start('boss1');
    },

    render: function() {

        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        // game.debug.bodyInfo(end, 3, 400);
        game.debug.bodyInfo(player, 3, 400);

    },
};
