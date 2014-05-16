var Human = function()
{
	this.sprite;
	this.speed = 25;
	this.stoped = true;
	this.moveTimer = 0;
	this.jumpTimer = 0;
}

Human.prototype.add = function(posX, posY, texture)
{
	this.sprite = game.add.sprite(posX, posY, texture);
	game.physics.enable(this.sprite);
	this.sprite.smoothed = false; // em false, se modificar o tamanho a imagem continua pixelada.
	this.sprite.anchor.setTo(0.5 ,0.5);
}

Human.prototype.stayNormal = function() //o human anda de um lado para o outro aleatoriamente.
{
	if(game.time.now > this.moveTimer)
	{
	var r = game.rnd.integerInRange(0,10);
	if (r == 10)
		this.sprite.body.velocity.x = 0;
	if ((r < 10) && (r >= 5))
		this.sprite.body.velocity.x = this.speed;
 	if(r <5)
		this.sprite.body.velocity.x = -this.speed;
	this.moveTimer = game.time.now + 1000;
	}
	if( (this.sprite.body.onFloor()) && (this.sprite.body.velocity.x !=0))
	{
		this.sprite.body.velocity.y = -85;
	}
		
}