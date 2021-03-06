var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var bool;
var end;
var flame = null;
var music;
var die;
var score = 0;
var scoreText;

var boss1 = {

    create: function() {
        bool = true;
        end = true;
        music = game.sound.play('castle');
        game.stage.backgroundColor = '#0000';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.map = game.add.tilemap('boss1');
        this.map.addTilesetImage('bowsers-castle', 'castle_png');

        this.layer = this.map.createLayer('background');
        this.layer = this.map.createLayer('bowser');
        this.layer = this.map.createLayer('world');

        this.layer.map.setCollision([853, 854, 865, 866, 867], true, this.layer);
        this.layer.resizeWorld();

        //SOUND
        die = new Audio('assets/soundEffects/smb_mariodie.wav');

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

        // SCORE
        scoreText = game.add.text(0, 0, 'score: 0', { fontSize: '12px', fill: '#000' });
        scoreText.fixedToCamera = true;

        // BOWSER
        bowser = game.add.sprite(860, game.world - 100, 'bowser');
        game.physics.arcade.enable(bowser);
        // bowser.body.immovable = true;
        // bowser.body.gravity.y = 0;
        bowser.body.setSize(32, 40, 8, 8)
        // bowser.body.collideWorldBounds = true;
        bowser.animations.add('breath', [1, 2]);
        bowser.animations.play('breath', 3, true);

        // PAUSE
        pause_label = game.add.text(720, 0, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.fixedToCamera = true;
        pause_label.events.onInputUp.add(function() {
            pause.play();
            game.paused = true;

            var again = game.add.text(300, 120, 'Try again ?', { font: '32px Arial', fill: '#fff' });
            again.inputEnabled = true;
            again.events.onInputUp.add(function() {
                game.paused = false;
                game.state.restart();
            });

            var menu = game.add.text(350, 170, 'Exit', { font: '32px Arial', fill: '#fff' });
            menu.inputEnabled = true;
            menu.events.onInputUp.add(function() {
                game.paused = false;
                game.state.start('menu');
            });

            var continues = game.add.text(310, 70, 'Continue', { font: '32px Arial', fill: '#fff' });
            continues.inputEnabled = true;
            continues.events.onInputUp.add(function() {
                again.destroy();
                menu.destroy();
                continues.destroy();
                game.paused = false;
                pause.play();
            });
        });
    },

    update: function() {
        game.physics.arcade.collide(player, this.layer);
        game.physics.arcade.collide(bowser, this.layer);
        game.physics.arcade.collide(player, bowser, this.touch);
        game.physics.arcade.overlap(player, flame, this.dead);
        game.physics.arcade.collide(flame, this.layer);

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
            game.sound.play('jump');
            player.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }

        if (player.x > 350 && bool) {
            bool = false;
            this.enableFlamme();
        }
    },

    touch: function(player, bowser) {
        flame.visible = false;
        end = false;
        bool = false;
        if (player.body.touching.down) {
            game.sound.play('dead');
            music.volume = 0;
            game.sound.play('end');
            bowser.animations.stop();
            bowser.animations.add('dead', [45, 46]);
            bowser.animations.play('dead', 3, true);
            bowser.body.setSize(32, 20, 98, 20);
            bowser.body.velocity.y = -80;
            score += 100;
            scoreText.text = 'Score: ' + score;
            game.time.events.add(Phaser.Timer.SECOND * 6, function() {
                game.sound.stopAll();
                bowser.kill();
                game.state.start('menu');
            });
        } else {
            player.frame = 6;
            player.body.enable = false;
            player.animations.stop();
            game.time.events.add(Phaser.Timer.SECOND * 0, function() {
                game.paused = true;
                die.play();
                setTimeout(function(){
                    music.volume = 0;
                    game.paused = false;
                    game.state.restart();
                }, 3500)
            });
        }
    },

    dead: function(player) {
        player.frame = 6;
        player.body.enable = false;
        player.animations.stop();
        game.time.events.add(Phaser.Timer.SECOND * 0, function() {
            game.paused = true;
            die.play();
            setTimeout(function(){
                music.volume = 0;
                game.paused = false;
                game.state.restart();
            }, 3500)
        });
    },

    enableFlamme: function() {
        if (end === true) {
            game.time.events.add(Phaser.Timer.SECOND * 2, function() {
                bool = true;
                game.sound.play('fire');
                flame = game.add.sprite(850, 288, 'flame');
                game.physics.arcade.enable(flame);
                flame.body.velocity.x = -150;
                flame.body.setSize(20, 20, 8, 8);
                game.debug.body(flame);
            });
        }else {
            return;
        }
    },

    render: function() {
        // game.debug.bodyInfo(player, 3, 400);
    },
};
