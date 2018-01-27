//API CALLS
//GAME.finish(score) //to finish

var GameDuckHunt = {
	version: 0.1,
	name: "messenger pigeon",
	scale: 2,
	to_load: ["data/duckhunt/diana.png", "data/duckhunt/fondo.png", "data/duckhunt/paloma.png", "data/duckhunt/palomagame.png", "data/duckhunt/paloma1.png"], //urls of images and sounds to load
	pigeon: ["data/duckhunt/palomagame.png", "data/duckhunt/paloma1.png"],
	width: 256,

	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		win_time: -1,
		pigeon: 0,
		pigeondown: 0,
		shotCooldown: 0,
		shotDuration: 0,
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
	},

	onEnter: function()
	{
	},

	onLeave: function()
	{
	},
	
	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
		this.state.win_time = -1;
		this.state.pigeon = 0;
		this.state.pigeondown = 0;
		this.state.shotCooldown = 0;
		this.state.shotDuration = 0;
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		this.width = w;
		var h = canvas.height;
		if(this.state.shotDuration > 0)
			ctx.fillStyle = "#ff0000";
		else	
			ctx.fillStyle = "#3dc2fd";
		ctx.fillRect(0,0,w,h);
		ctx.drawImage( APP.assets["data/duckhunt/fondo.png"],0,0);

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText("Kill the pigeon!:", 10, 20);

		ctx.save();
		ctx.beginPath();
		ctx.rect(4, 0, w - 8, h);
		ctx.clip();

		ctx.drawImageCentered( APP.assets[this.pigeon[this.state.win_time < 0 ? Math.floor(this.state.time*10) % 2 : 1]], this.state.pigeon, ctx.canvas.height/2 + this.state.pigeondown, 1);


		ctx.drawImageCentered( APP.assets["data/duckhunt/diana.png"], w/2, h/2, 0.7);
		if(this.state.win_time > 0 )
		{
			ctx.textAlign = "center";
			ctx.font = "16px pixel";
			ctx.fillStyle = "black";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.textAlign = "left";
		}

		ctx.restore();
		
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if(this.state.win_time < 0){
			this.state.pigeon = Math.floor(this.state.pigeon + dt*200)%(1.5*this.width);
			this.state.shotCooldown -= dt;
			this.state.shotDuration -= dt;
		}else{
			this.state.pigeon += dt*50;
			this.state.pigeondown += dt*20;

			if(this.state.win_time + 2 < this.state.time){
				GAMES.playerWin();
				return;
			}
		}
		
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" && this.state.win_time < 0 && this.state.shotCooldown < 0){
			this.state.shotCooldown = 1;
			this.state.shotDuration = 0.1;
			if(this.state.pigeon > this.width/2 - 5 && this.state.pigeon < this.width/2 + 5){
				this.state.win_time = this.state.time;
				GAMES.playSound("data/win1.wav", 0.5);
			}
		}
	},

	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameDuckHunt );

