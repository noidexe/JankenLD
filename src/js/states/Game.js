var Janken = Janken || {};

Janken.Game = function () {
    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
/*
    this.game;      //  a reference to the currently running game
    this.add;       //  used to add sprites, text, groups, etc
    this.camera;    //  a reference to the game camera
    this.cache;     //  the game cache
    this.input;     //  the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;      //  for preloading assets
    this.math;      //  lots of useful common math operations
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc
    this.stage;     //  the game stage
    this.time;      //  the clock
    this.tweens;    //  the tween manager
    this.state;     //  the state manager
    this.world;     //  the game world
    this.particles; //  the particle manager
    this.physics;   //  the physics manager
    this.rnd;       //  the repeatable random number generator*/
};

Janken.Game.prototype = {

    preload: function () {
        this.game.load.image('jankencore', 'assets/img/janken.png');
        this.game.load.image('jpaper', 'assets/img/jankenpaper.png');
        this.game.load.image('jscissors', 'assets/img/jankenscissors.png');
        this.game.load.image('jrock', 'assets/img/jankenrock.png');
        this.game.load.image('paper', 'assets/img/paper.png');
        this.game.load.image('scissors', 'assets/img/scissors.png');
        this.game.load.image('rock', 'assets/img/rock.png');
    },

    create: function () {
        //DEBUG

        //GAMEPAD
        this.game.input.gamepad.start();
        this.pad1 = this.game.input.gamepad.pad1;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.janken = this.add.sprite(0,0, 'jankencore');
        this.jpaper = this.add.sprite(0,0,'jpaper');
        this.jrock = this.add.sprite(0,0,'jrock');
        this.jscissors = this.add.sprite(0,0,'jscissors');

        this.enemies = this.add.group();
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.enableBody = true;

        this.game.physics.enable(this.janken, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.jpaper, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.jrock, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.jscissors, Phaser.Physics.ARCADE);


        this.janken.body.setSize(30,30,0,0);
        this.jrock.body.setSize(35,35,0,0);
        this.jscissors.body.setSize(35,35,0,0);
        this.jpaper.body.setSize(35,35,0,0);

        this.janken.anchor.setTo(0.5,0.5);
        this.jpaper.anchor.setTo(0.5,0.5);
        this.jrock.anchor.setTo(0.5,0.5);
        this.jscissors.anchor.setTo(0.5,0.5);

        this.janken.addChild(this.jpaper);
        this.janken.addChild(this.jrock);
        this.janken.addChild(this.jscissors);
        this.janken.scale.setTo(0.75,0.75);
        this.jrock.position.setTo(60,40);
        this.jpaper.position.setTo(-60,40);
        this.jscissors.position.setTo(2,-70);


        this.janken.position.setTo(500,320);
        this.janken.body.maxVelocity = new Phaser.Point(300,300);
        this.janken.body.drag = new Phaser.Point(2000,2000);
        this.janken.body.angularDrag = 2000;
        this.janken.body.maxAngular = 300;

        //AUDIO
        // NOTE: Should we init this on every level we load?
        /*
        Janken.Audio.init(this.game);

        if(!Janken.Audio.muted) {
            Janken.Audio.sfxVol = 0.2;
            Janken.Audio.musicVol = 0.2;
            Janken.Audio.play('music' + this.game.rnd.integerInRange(1,3), true);
        }
        */


    },


    update: function () {
        var fuckyou;
        if( this.math.chanceRoll(1) )
        {
            fuckyou = new Janken.Rock(this, this.janken);
            this.enemies.add(fuckyou);
        }
        if( this.math.chanceRoll(1) )
        {
            fuckyou = new Janken.Paper(this, this.janken);
            this.enemies.add(fuckyou);
        }
        if( this.math.chanceRoll(1) )
        {
            fuckyou = new Janken.Scissors(this, this.janken);
            this.enemies.add(fuckyou);
        }

        //this.janken.rotation += 0.01;
        //this.janken.position = this.game.input;
        this.game.physics.arcade.overlap(this.enemies, this.jrock, this.handleCollision,null,this);
        this.game.physics.arcade.overlap(this.enemies, this.jpaper, this.handleCollision,null,this);
        this.game.physics.arcade.overlap(this.enemies, this.jscissors, this.handleCollision,null,this);
        this.game.physics.arcade.collide(this.enemies);
        this.game.physics.arcade.overlap(this.enemies, this.janken, this.handleCollision,null,this);

        if(this.pad1.connected) {
            if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1) {
                this.janken.body.acceleration.x = -2000;
            }
            else if(this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1) {
                this.janken.body.acceleration.x = +2000;
            }
            else {
                this.janken.body.acceleration.x = 0;
            }

            if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1) {
                this.janken.body.acceleration.y = -2000;
            }
            else if(this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1) {
                this.janken.body.acceleration.y = +2000;
            }
            else {
                this.janken.body.acceleration.y = 0;
            }

            if (this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) < -0.1) {
                this.janken.body.angularAcceleration = -2000;
            }
            else if(this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_RIGHT_X) > 0.1) {
                this.janken.body.angularAcceleration = +2000;
            }
            else {
                this.janken.body.angularAcceleration = 0;
            }
        }
    },

    render: function () {
        //this.game.debug.body(this.jrock);
        //this.game.debug.body(this.jpaper);
        //this.game.debug.body(this.jscissors);
        //this.game.debug.body(this.janken);
    },

    quitGame: function () {
        // Stop music, delete sprites, purge caches, free resources, all that good stuff.
        // Then let's go back to the main menu.
        this.game.state.start('MainMenu');
    },

    handleCollision: function (weapon,enemy) {
        console.log(weapon.key + ' collided with ' + enemy.key );

        if (weapon.key === 'jrock' && enemy.key === 'scissors') {
            enemy.kill();
        }
        else if (weapon.key === 'jrock' && enemy.key === 'paper') {
            weapon.kill();

        }
        else if (weapon.key === 'jrock' && enemy.key === 'rock') {
            weapon.kill();
            enemy.kill();
        }

        if (weapon.key === 'jscissors' && enemy.key === 'paper') {
            enemy.kill();
        }
        else if (weapon.key === 'jscissors' && enemy.key === 'rock') {
            weapon.kill();
        }
        else if (weapon.key === 'jscissors' && enemy.key === 'scissors') {
            weapon.kill();
            enemy.kill();
        }

        if (weapon.key === 'jpaper' && enemy.key === 'rock') {
            enemy.kill();
        }
        else if (weapon.key === 'jpaper' && enemy.key === 'scissors') {
            weapon.kill();
        }
        else if (weapon.key === 'jpaper' && enemy.key === 'paper') {
            weapon.kill();
            enemy.kill();
        }

        if (weapon.key === 'jankencore') {
            weapon.kill();
        }

    }

};



Janken.Rock = function(game) {
    Phaser.Sprite.call(this, game, game.rnd.between(0,800), 0, 'rock');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.setTo(0.75,0.75);
    this.anchor.setTo(0.5,0.5);
    this.body.setSize(30,30,0,0);
    //this.body.immovable = false;
    this.body.allowGravity = false;
    this.body.velocity.y = 70;

    game.add.existing(this);

};

Janken.Rock.prototype = Object.create(Phaser.Sprite.prototype);
Janken.Rock.constructor = Janken.Rock;

Janken.Rock.prototype.update = function () {
    //this.game.physics.arcade.overlap(Pichon.CollisionManager.player.sprite, this, Pichon.CollisionManager.hitGema,null,Pichon.CollisionManager);
};

Janken.Paper = function(game) {
    Phaser.Sprite.call(this, game, game.rnd.between(0,800), 0, 'paper');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.setTo(0.75,0.75);
    this.anchor.setTo(0.5,0.5);
    this.body.setSize(30,30,0,0);
    //this.body.immovable = false;
    this.body.allowGravity = false;
    this.body.velocity.y = 50;

    game.add.existing(this);

};

Janken.Paper.prototype = Object.create(Phaser.Sprite.prototype);
Janken.Paper.constructor = Janken.Rock;

Janken.Paper.prototype.update = function () {
    //this.game.physics.arcade.overlap(Pichon.CollisionManager.player.sprite, this, Pichon.CollisionManager.hitGema,null,Pichon.CollisionManager);
};

Janken.Scissors = function(game) {
    Phaser.Sprite.call(this, game, game.rnd.between(0,800), 0, 'scissors');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.scale.setTo(0.75,-0.75);
    this.anchor.setTo(0.5,0.5);
    this.body.setSize(30,30,0,0);
    //this.body.immovable = false;
    this.body.allowGravity = false;
    this.body.velocity.y = 100;

    game.add.existing(this);

};

Janken.Scissors.prototype = Object.create(Phaser.Sprite.prototype);
Janken.Scissors.constructor = Janken.Rock;

Janken.Scissors.prototype.update = function () {
    //this.game.physics.arcade.overlap(Pichon.CollisionManager.player.sprite, this, Pichon.CollisionManager.hitGema,null,Pichon.CollisionManager);
};
