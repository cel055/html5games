var GameScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        var layer = new GameLayer();
        layer.init();
        this.addChild(layer);
    }
});
var GameLayer = cc.Layer.extend({ 
	sprite:null,
	diff:cc.p(0,0),
	actions:null,
	tatics:null,
    init:function()
    {
        this._super();
		this.setMouseEnabled(true);
		this.setTouchEnabled(true);
        var map = cc.TMXTiledMap.create("assets/tiles/map.tmx");
		//var map = cc.TMXTiledMap.create("assets/tiles/iso-test.tmx");
        this.addChild(map, 0);
		
		var layer = map.getLayer("Camada de Tiles 1");
		this.sprite = new sprite();//cc.Sprite.create("assets/tiles/sprite1.png")
		var tile0 = layer.getTileAt(cc.p(0,0));
		var x = tile0.getPosition().x + 30;
		var y = tile0.getPosition().y + 72;
		this.sprite.setPosition(cc.p(x,y));
		this.addChild(this.sprite);
		cc.registerTargetedDelegate(0, true, this.sprite);
		this.setTag(1);
		this.centrarPersonagem(this.sprite);
		return this;
    },
	centrarPersonagem:function(pers){
		var tela = cc.Director.getInstance().getWinSize();
		var centro = cc.p(tela.width/2, tela.height/2);
		this.setPosition(cc.pAdd(cc.pNeg(pers.getPosition()), centro));
	},
	openOptions:function(){
		
	},
	onTouchesEnded:function(touch, event){
		var getPoint = touch[0].getLocation();
		getPoint = cc.pAdd(cc.pNeg(this.getPosition()), getPoint);
		if(this.sprite.movable){
			this.sprite.move(getPoint);
			this.sprite.movable = false;
		}
		var rect = cc.rect(this.sprite.getPosition().x - 24, this.sprite.getPosition().y - 56,48,113);
		if(cc.rectContainsPoint(rect, getPoint)){
			if(this.actions == null){
				var spriteAttack = cc.Sprite.create("assets/tiles/btnAttack.png");
				var spriteMove = cc.Sprite.create("assets/tiles/btnMove.png");
				var spriteTatics = cc.Sprite.create("assets/tiles/btnTatics.png");
				var spriteItens = cc.Sprite.create("assets/tiles/btnItens.png");
				var btnAttack = cc.MenuItemSprite.create(spriteAttack,null,null, 'Attack',this);
				var btnMove = cc.MenuItemSprite.create(spriteMove, null,null, 'moveSprite', this);
				var btnTatics = cc.MenuItemSprite.create(spriteTatics,null,null, 'openTatics',this);
				var btnItens = cc.MenuItemSprite.create(spriteItens, null,null, 'Itens', this);
				btnAttack.setPosition(0,20);
				btnMove.setPosition(60,0);
				btnTatics.setPosition(60,40);
				btnItens.setPosition(120,20);
				this.actions = cc.Menu.create(btnAttack, btnMove, btnTatics, btnItens);
				this.actions.setPosition(this.sprite.getPosition().x + 24, this.sprite.getPosition().y + 56);
				this.addChild(this.actions);
			}else{
				this.actions.setPosition(this.sprite.getPosition().x + 24, this.sprite.getPosition().y + 56);
			}
		}else{
			this.actions.setPosition(-90000, -90000);
			if(this.tatics !==null){
				this.tatics.setPosition(-90000,-90000);
			}
		}
	},
	moveSprite:function(){
		this.sprite.movable = true;
	},
	openTatics:function(){
		if(	this.tatics == null){
			var spriteCrouch = cc.Sprite.create("assets/tiles/btnCrouch.png");
			var spriteProne = cc.Sprite.create("assets/tiles/btnProne.png");
			var spriteCover = cc.Sprite.create("assets/tiles/btnCover.png");
			var btnCrouch = cc.MenuItemSprite.create(spriteCrouch,null,null, this.sprite.crouch,null);
			var btnProne = cc.MenuItemSprite.create(spriteProne, null,null, this.sprite.prone, null);
			var btnCover = cc.MenuItemSprite.create(spriteCover,null,null, this.sprite.cover,null);
			btnProne.setPosition(0,20);
			btnCover.setPosition(0,40);
			this.tatics = cc.Menu.create(btnCrouch, btnProne, btnCover);
			this.tatics.setPosition(this.sprite.getPosition().x + 140, this.sprite.getPosition().y + 140);
			this.addChild(this.tatics);
		}else{
			this.tatics.setPosition(this.sprite.getPosition().x + 140, this.sprite.getPosition().y + 140);
		}
	},
	onMouseDragged:function (event) {
        var delta = event.getDelta();
        this.diff = cc.pAdd(delta, this.getPosition());
        this.setPosition(this.diff);
    }
});