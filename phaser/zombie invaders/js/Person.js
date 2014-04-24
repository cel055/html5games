var Person = function (index, game) {
	
    var x = game.world.randomX;
    var y = game.rnd.integerInRange(800, 900);

    this.game = game;
    this.alive = true;

    this.spritePerson = this.game.add.sprite(x, y,'personDown');
    
    this.spritePerson.animations.add('personWalkDown');
    this.spritePerson.animations.play('personWalkDown', 10, true);


    this.spritePerson.name = index.toString();
    this.game.physics.enable(this.spritePerson, Phaser.Physics.ARCADE);
    
    this.spritePerson.body.enable = true;
    
    this.spritePerson.body.setSize(personWidth,10,0,personHeigth-10);

    this.spritePerson.body.collideWorldBounds = true;
    this.spritePerson.body.bounce.setTo(1, 1);
    
    this.spritePerson.body.velocity.x  = -Math.random()*10;
    this.spritePerson.body.velocity.y  = -Math.random()*10;

};
