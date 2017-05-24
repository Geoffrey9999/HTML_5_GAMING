var map;
var tileset;
var layer;
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;

var boss1 = {

    create: function() {

        game.stage.backgroundColor = '#0000';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.map = game.add.tilemap('boss1');

        this.map.addTilesetImage('bowsers-castle', 'castle_png');

        this.layer = this.map.createLayer('background');
        this.layer = this.map.createLayer('world');

        this.layer.map.setCollision([865, 866, 867], true, this.layer);
        this.layer.resizeWorld();

        // this.layer.debug = true;

        game.physics.arcade.gravity.y = 110;

        // MARIO
        player = game.add.sprite(16, game.world - 100, 'mario');
        game.physics.arcade.enable(player);
        player.body.gravity.y = 370;
        player.body.collideWorldBounds = true;
        player.animations.add('right', [1, 2, 3], 10, true);
        player.animations.add('left', [8, 9, 10], 10, true);

        game.camera.follow(player);

        cursors = game.input.keyboard.createCursorKeys();

        // BOWSER
        bowser = game.add.sprite(860, game.world - 100, 'bowser');
        game.physics.arcade.enable(bowser);
        bowser.body.immovable = true;
        bowser.body.gravity.y = 570;
        bowser.body.setSize(32, 40, 8, 8)
        bowser.body.collideWorldBounds = true;
        bowser.animations.add('breath', [1, 2]);
        bowser.animations.play('breath', 3, true);

        // HAMMER
        hammer = game.add.sprite(160, 0, 'hammer');
        game.physics.arcade.enable(hammer);
        hammer.animations.add('launch', [48]);
        hammer.body.setSize(20, 20, 8, 8)
        hammer.animations.play('launch', 3, true);
        hammer.body.gravity.y = 570;
        hammer.body.collideWorldBounds = true;
    },

    update: function() {
        game.physics.arcade.collide(player, this.layer);
        game.physics.arcade.collide(bowser, this.layer);
        game.physics.arcade.collide(player, bowser, this.touch);

        hammer.body.velocity.x = -150;
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

    touch: function(player, bowser) {
        if (player.body.touching.down) {
            bowser.animations.stop();
            bowser.animations.add('dead', [45, 46, 47]);
            bowser.animations.play('dead', 3, true);
            bowser.body.setSize(32, 20, 8, 20)
            // bowser.body.enable = false;
            bowser.body.velocity.y = -80;
            game.time.events.add(Phaser.Timer.SECOND * 1, function() {
                bowser.kill();
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

    render: function() {

        // game.debug.text(game.time.physicsElapsed, 32, 32);
        // game.debug.body(player);
        game.debug.body(bowser)
        game.debug.body(hammer)
        // game.debug.bodyInfo(end, 3, 400);
        game.debug.bodyInfo(player, 3, 400);

    },
};
