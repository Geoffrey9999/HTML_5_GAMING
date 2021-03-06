var map;
var tileset;
var layer;
var player;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var life = 3;
var count = 0;
var bool = true;
var score = 0;
var scoreText;
var star = [];
var i = 0;
var gameOver;
var die;

var level1 = {

    create: function() {

        game.sound.play('main', true);
        game.stage.backgroundColor = '#5c94fc';
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
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

        // SOUND
        gameOver = new Audio('assets/soundEffects/smb_gameover.wav');
        die = new Audio('assets/soundEffects/smb_mariodie.wav');
        pause = new Audio('assets/soundEffects/smb_pause.wav');
        clear = new Audio('assets/soundEffects/smb_stage_clear.wav');

        // PAUSE
        pause_label = game.add.text(720, 0, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.fixedToCamera = true;
        pause_label.inputEnabled = true;

        // TRY AGAIN
        var again = game.add.text(300, 120, 'Try again ?', { font: '32px Arial', fill: '#fff' });
        again.fixedToCamera = true;
        again.visible = false;

        // BACK TO MENU
        var menu = game.add.text(350, 170, 'Exit', { font: '32px Arial', fill: '#fff' });
        menu.fixedToCamera = true;
        menu.visible = false;

        // CONTINUE
        var continues = game.add.text(310, 70, 'Continue', { font: '32px Arial', fill: '#fff' });
        continues.fixedToCamera = true;
        continues.visible = false;

        pause_label.events.onInputUp.add(function() {
            if (!game.paused) {
                pause_label.inputEnabled = false;
                pause.play();
                game.paused = true;
                again.visible = true;
                again.inputEnabled = true;
                again.events.onInputUp.add(function() {
                    game.paused = false;
                    game.state.restart();
                });
                menu.visible = true;
                menu.inputEnabled = true;
                menu.events.onInputUp.add(function() {
                    game.paused = false;
                    game.state.start('menu');
                });
                continues.visible = true;
                continues.inputEnabled = true;
                pause_label.inputEnabled = true;
                continues.events.onInputUp.add(function() {
                    again.kill();
                    menu.kill();
                    continues.kill();
                    game.paused = false;
                    pause.play();
                });
            }
        });

        // SCORE
        scoreText = game.add.text(0, 16, 'score: 0', { fontSize: '12px', fill: '#000' });
        scoreText.fixedToCamera = true;

        // STAR
        for (i = 0 ; i < life ; i++) {
            star[i] = game.add.sprite(count, 0, 'life', 18);
            count += 16;
            star[i].fixedToCamera = true;
        }

        // HOLES
        holes = game.add.group();
        holes.enableBody = true;
        map.createFromObjects('end', 'hole', 0, 0, true, false , holes);
        holes.setAll('body.gravity', 0);

        // END MAP
        end = game.add.group();
        end.enableBody = true;
        map.createFromObjects('end', 'finish', 0, 0, true, false, end);
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
            game.sound.play('jump');
            player.body.velocity.y = -250;
            jumpTimer = game.time.now + 750;
        }
        if (life === 0 ) {
            this.gameOver();
        }
    },

    coinOverlap: function(player, coin) {
        coin.kill();
        game.sound.play('coin');
        score += 10;
        scoreText.text = 'score: ' + score;
    },

    goombaOverlap: function(player, goomba) {
        if (player.body.touching.down) {
            game.sound.play('kick');
            goomba.animations.stop();
            goomba.frame = 2;
            goomba.body.enable = false;
            player.body.velocity.y = -80;
            game.time.events.add(Phaser.Timer.SECOND, function() {
                score += 10;
                scoreText.text = 'score: ' + score;
                goomba.kill();
            });
        } else {
            game.sound.play('hit');
            star[life - 1].destroy();
            goomba.kill();
            return life--;
        }
    },

    gameOver: function() {
        player.frame = 6;
        player.body.enable = false;
        player.animations.stop();
        game.paused = true;
        die.play();
        setTimeout(function() {
            game.paused = false;
            location.reload();
        }, 2600);
    },

    dead: function(player, holes) {
        if (player.body.touching.down) {
            player.frame = 6;
            player.body.enable = false;
            player.animations.stop();
            game.time.events.add(Phaser.Timer.SECOND * 0, function() {
                game.paused = true;
                gameOver.play();
                setTimeout(function() {
                    game.paused = false;
                    location.reload();
                }, 4000);
            });
        }
    },

    finishLine: function(player, end) {
        clear.play();
        game.paused = true;
        player.frame = 4;
        setTimeout(function() {
            game.sound.stopAll();
            game.paused = false;
            game.state.start('boss1');
        }, 6000);
    },

    render: function() {
        // game.debug.bodyInfo(player, 3, 400);

    },
};
