//API CALLS
//GAME.finish(score) //to finish

var GameVirus = {
	version: 0.1,
	name: "virus",
	scale: 1,
	to_load: ["data/virus/labnormal.png", "data/virus/labinfected.png", "data/virus/virus1.png", "data/virus/virus2.png"], //urls of images and sounds to load

	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		win_time: -1,
		fail: -1,
		virusx: 0,
		virusy: 0,
		microscopex: 0,
		microscopey: 0,
		found: 0,
		remainingtime: 1,
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
	
	restart: function(){
		this.state.win_time = -1;
		this.state.fail = -1;
		var x = Math.floor(Math.random()*140) + 60;
		var y = Math.floor(Math.random()*140) + 60;
		this.state.virusx = Math.random() < 0.5 ? -x : x;
		this.state.virusy = Math.random() < 0.5 ? -y : y;
		this.state.microscopex = 0;
		this.state.microscopey = 0;
		this.state.found = 0;
		this.state.remainingtime = 1;
	},

	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
		this.restart();
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;

		ctx.fillStyle = "#676767";
		ctx.fillRect(0,0,w,h);

		ctx.save();
		if(this.state.win_time < 0 && this.state.fail < 0){
			ctx.beginPath();
			ctx.arc(w/2, h/2, 50, 0, 2*Math.PI);
			ctx.clip();

			ctx.drawImageCentered(APP.assets["data/virus/labnormal.png"], w/2 + this.state.microscopex, h/2 + this.state.microscopey);
			ctx.drawImageCentered(APP.assets[Math.floor(this.state.time) % 2 == 0 ? "data/virus/virus1.png" : "data/virus/virus2.png"], w/2 + this.state.virusx + this.state.microscopex, h/2 + this.state.virusy + this.state.microscopey);
		}else if(this.state.fail >= 0){
			ctx.drawImageCentered(APP.assets["data/virus/labinfected.png"], w/2, h/2, 0.5);
			ctx.drawImageCentered(APP.assets[Math.floor(this.state.time) % 2 == 0 ? "data/virus/virus1.png" : "data/virus/virus2.png"], w/2 + this.state.virusx/2, h/2 + this.state.virusy/2);
			for(var i=0; i<10*(this.state.time - this.state.fail); i++){
				ctx.drawImageCentered(APP.assets[Math.floor(this.state.time + i) % 2 == 0 ? "data/virus/virus1.png" : "data/virus/virus2.png"], w/2 + 200*(Math.random()-0.5), h/2 + 200*(Math.random()-0.5), 0.5);
			}
			
		}else if(this.state.win_time >= 0){
			ctx.drawImageCentered(APP.assets["data/virus/labnormal.png"], w/2, h/2, 0.5);
			ctx.drawImageCentered(APP.assets[Math.floor(this.state.time) % 2 == 0 ? "data/virus/virus1.png" : "data/virus/virus2.png"], w/2 + this.state.virusx/2, h/2 + this.state.virusy/2, 0.25);
		}

		
		ctx.restore();

		if(this.state.win_time == -1 )
		{
			ctx.fillStyle = "cyan";
			ctx.fillRect( 0, h - 4, w * this.state.remainingtime, 4 );
		}

		if(this.state.remainingtime > 0.8 )
		{
			ctx.lineWidth = 2;
			ctx.font = "16px pixel";
			ctx.textAlign = "center";
			ctx.strokeStyle = "black";
			ctx.fillStyle = "white";
			ctx.strokeText( "FIND THE VIRUS", w * 0.5, h * 0.25 );
			ctx.fillText( "FIND THE VIRUS", w * 0.5, h * 0.25 );
			ctx.textAlign = "left";
			ctx.lineWidth = 1;
		}

		if(this.state.win_time > 0){
			ctx.textAlign = "center";
			ctx.font = "16px pixel";
			ctx.fillStyle = "black";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.textAlign = "left";
		}
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if(this.state.win_time < 0){
			this.state.remainingtime -= dt*0.15;
		}

		if(this.state.fail >= 0 && this.state.fail + 1 < this.state.time){
			this.restart();
		}else if(this.state.win_time >= 0 && this.state.win_time + 2 < this.state.time){
			GAMES.playerWin();
			return;
		}else if(this.state.fail < 0 && this.state.win_time < 0){
			if(this.state.found >= 1){
				this.state.win_time = this.state.time;
				GAMES.playSound("data/win1.wav", 0.5);
			}else{
				var dx = Math.abs(this.state.microscopex + this.state.virusx);
				var dy = Math.abs(this.state.microscopey + this.state.virusy);
				console.log(this.state)
				if(dx < 50 && dy < 50){
					this.state.found += dt;
				}
			}
			
			if(this.state.remainingtime <= 0){
				this.state.fail = this.state.time;
			}
		}
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousemove" && e.dragging){
			this.state.microscopex += e.deltax;
			if(this.state.microscopex > 206) this.state.microscopex = 206;
			else if(this.state.microscopex < -206) this.state.microscopex = -206;
			this.state.microscopey += e.deltay;
			if(this.state.microscopey > 206) this.state.microscopey = 206;
			else if(this.state.microscopey < -206) this.state.microscopey = -206;
		}
	},

	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameVirus );

