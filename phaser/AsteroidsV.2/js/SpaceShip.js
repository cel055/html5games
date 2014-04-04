SpaceShip = function(gameClass, x, y) {
	this.game = gameClass.game;
    this.gameClass = gameClass;
    this.sprite = null;
    this.bullet = null;
    this.bulletsGroup = null;
    this.shootInterval = 10;
    this.nextFire = 0;
    this.fireRate = 200;
    this.teleportTime = 3000;
    this.nextTeleport = 0;
    this.lives = 3;
    this.changeShootKey = null;
    this.shootType = 0;
    this.sound = null;
    this.create(x,y);
    
};

SpaceShip.prototype.create = function(x,y){
	this.shootType = 0;
	this.sound = this.game.add.audio('laserSound', 1);
	this.sprite = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'sprites', 'ship1-blue1-13-21.png');
	//this.sprite = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'ships', 'wr wing 0.png');
	//this.sprite = this.game.add.sprite(this.game.world.width/2, this.game.world.height/2, 'ships', 'wra wing 0.png');
    
	//this.sprite.events.onOutOfBounds.add(this.gameClass.outOfBounds,this);
	this.changeShootKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.changeShootKey.onDown.add(this.changeShoot, this);
	this.sprite.name = 'ship';
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;
    this.sprite.body.gravity.x = 0;
    this.sprite.body.gravity.y = 0;
    this.sprite.body.maxVelocity.x = 1000;
    this.sprite.body.maxVelocity.y = 500;
    this.sprite.body.maxAngularVelocity = 20;
    this.sprite.body.setPolygon(1, -14  , 18, -38  , 36, -14);
    this.sprite.body.translate(0,40);
    this.sprite.smoothed = false;
    //this.sprite.scale.setTo(1.5,1.5);
    this.shootInterval = 10;
    this.bulletsGroup = this.game.add.group();
    this.bulletsGroup.createMultiple(50, 'shoots', 'LaserRedBall.png');
    this.bulletsGroup.setAll('anchor.x', 0.5);
    this.bulletsGroup.setAll('anchor.y', 0.5);
    this.bulletsGroup.setAll('outOfBoundsKill', true);
    
    this.sprite.animations.add('thrust', ['ship1-blue1-13-21.png', 'ship1-blue2-13-21.png'], 15, true, false);
    this.sprite.animations.add('stop', ['ship1-blue1-13-21.png']);
    this.game.camera.follow(this.sprite);
};

SpaceShip.prototype.update = function () {
    this.gameClass.warp(this.sprite);
};

SpaceShip.prototype.changeShoot = function(){
	this.shootType++;
	if(this.shootType>=2)
	{
		this.shootType = 0;
	}
};

SpaceShip.prototype.animate = function(){	
	if(!this.sprite.animations.getAnimation('thrust').isPlaying){
		this.sprite.animations.play('thrust');
	}
};

SpaceShip.prototype.rotate = function (direction) {

    if ( direction == "left")
        this.sprite.body.rotation -= 5;
    if ( direction == "right")
        this.sprite.body.rotation += 5;

};

SpaceShip.prototype.accelerate = function () {

    game.add.audio('thrust', 1).play();
    
    this.sprite.body.acceleration.x = Math.cos((this.sprite.body.rotation + 270)*0.0174) *200;
	this.sprite.body.acceleration.y = Math.sin((this.sprite.body.rotation + 270)*0.0174) *200;

};

SpaceShip.prototype.stop = function () {
    this.sprite.body.acceleration.setTo(0, 0);
    this.sprite.animations.stop('thrust');
    this.sprite.animations.play('stop');
};

SpaceShip.prototype.teletransport = function () {
    if (game.time.now > this.nextTeleport)
    {
    	this.nextTeleport = game.time.now + this.teleportTime;
    	this.sprite.x = Math.random() * game.width;
    	this.sprite.y = Math.random() * game.height;
    }
};
 	
SpaceShip.prototype.shoot = function () {    
	if(this.sprite.alive){
    if(this.shootType == 0){
    	if (game.time.now > this.nextFire && this.sprite.alive)
    	{
    		this.nextFire = game.time.now + this.fireRate;
    		this.game.add.audio('shoot', 1).play();
    		
    		this.bullet = this.bulletsGroup.getFirstDead();
    		this.bullet.loadTexture('sprites', 'shoot-blue-18-3.png');
    		this.bullet.reset(this.sprite.position.x + Math.cos((this.sprite.body.rotation + 270)*0.0174) *24,
        					  this.sprite.position.y + Math.sin((this.sprite.body.rotation + 270)*0.0174) *24);
    		this.game.physics.velocityFromAngle(this.sprite.body.rotation - 90, 500, this.bullet.body.velocity);
    		this.bullet.events.onOutOfBounds.add(this.destroyShoot, this);
    		this.bullet.name = 'shoot';

    		this.bullet.angle = this.sprite.angle + 90;
    		//this.bullet.scale.setTo(1.5,1.5);
    		this.shootInterval = 10;
    	}
    }else if(this.shootType == 1 && !game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
    	this.bullet = this.bulletsGroup.getFirstDead();
    	if(this.bullet != null){
    		this.bullet.loadTexture('sprites', 'shoot-green-18-3.png');
    		if(!this.sound.isPlaying){
    			this.sound.play();
    		}
    		this.bullet.reset(this.sprite.position.x + Math.cos((this.sprite.body.rotation + 270)*0.0174) *15,
    					      this.sprite.position.y + Math.sin((this.sprite.body.rotation + 270)*0.0174) *15);
    		this.game.physics.velocityFromAngle(this.sprite.body.rotation - 90, 600, this.bullet.body.velocity);
    		this.bullet.body.velocity.x += this.sprite.body.velocity.x;
    		this.bullet.body.velocity.y += this.sprite.body.velocity.y;
    		this.bullet.events.onOutOfBounds.add(this.destroyShoot, this);
    		this.bullet.rotation = this.sprite.rotation;
    		this.bullet.name = 'laser';
    	}
    }
	}
};

SpaceShip.prototype.destroyShoot = function (shoot) {
	shoot.kill();
};