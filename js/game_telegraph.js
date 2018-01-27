//API CALLS
//GAME.finish(score) //to finish

var GameTelegraph = {
	name: "telegraph",
	scale: 2,
	to_load: ["data/telegraph/sprite_1.png", "data/telegraph/sprite_2.png", "data/telegraph/sprite_3.png"], //urls of images and sounds to load
	
	morseCodes: [
		"--. .- -- .",
		".--- .- --",
		"-... -.-. -.",
		"--. -... .---",
		"...- --. .-",
	],

	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		background: 0,
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		mousebutton_was_pressed: false,	//not used
		mousebutton_was_released: false,
		mousePressCooldown: 0,
		morse: "",
		morseProgress: 0,
		state: 0,
		win_time: -1,
		volume: 0,
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
		this.audio = new Audio();
		this.audio.autoplay = false;
		this.audio.src = "data/telegraph/beep.mp3";
		this.audio.loop = true;
		this.audio.volume = this.state.volume;
	},

	onEnter: function()
	{
		this.audio.play();
	},

	onLeave: function()
	{
		this.audio.pause();
	},
	
	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
		this.state.state = 0;
		this.state.win_time = -1;
		this.state.morseProgress = 0;
		this.state.morse = this.morseCodes[ Math.floor(Math.random() * this.morseCodes.length) ];
	},

	drawMorse: function( ctx, code, x, y )
	{
		var ax = x;
		for(var i in code){
			var c = code[i];
			if(i == this.state.morseProgress){
				ctx.strokeStyle = "yellow";
				ctx.beginPath();
				ctx.moveTo(ax, y-6);
				ctx.lineTo(ax, y+2);
				ctx.stroke();
			}
			switch(c){
				case " ":
					ax += 4;
					break;
				case ".":
					ctx.fillRect(ax+1, y-2, 2, 2);
					ax += 4;
					break;
				case "-":
					ctx.fillRect(ax+1, y-4, 6, 2);
					ax += 8;
					break;
			}
		}
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		ctx.drawImage( APP.assets[this.to_load[this.state.background]],0,0);

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText("Send:", 10, 20);

		if(this.state.state == 2) ctx.fillStyle = "#8bc34a";
		else if(this.state.state == 1) ctx.fillStyle = "red";
		this.drawMorse(ctx, this.state.morse, 50, 20);
		
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
		
	},

	checkMorse()
	{
		if(this.state.win_time > -1 && (this.state.win_time + 2) < this.state.time )
		{
			GAMES.playerWin();
			return;
		}
	
		var m;
		if(this.state.mousebutton_was_released){
			var t = this.state.time - this.state.mousedown_when;
			if(t < 0.3) m = ".";
			else m = "-";

			if(m == this.state.morse[this.state.morseProgress]) this.state.morseProgress += 1;
			else {
				this.state.morseProgress = 0;
				this.state.state = 1;
			}
		}else if(this.state.time - this.state.mouseup_when > 0.3){
			if(" " == this.state.morse[this.state.morseProgress]) this.state.morseProgress += 1;
		}

		if(this.state.state != 2 && this.state.morseProgress >= this.state.morse.length)
		{
			this.state.win_time = this.state.time;
			this.state.state = 2;
			GAMES.playSound("data/win1.wav", 0.5);
		}
		
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if(dt > 1) dt = 1;

		this.checkMorse();

		if(this.state.mousedown){
			this.state.volume = 0.5;
			this.state.background = this.state.mousePressCooldown > 0 ? 1 : 2;
		}else{
			if(this.state.mousePressCooldown <= 0){
				this.state.volume = 0;
				this.state.background = 0;
			}else{
				this.state.background = 1;
			}
		}

		this.audio.volume = this.state.volume;
		this.state.mousePressCooldown -= dt;
		this.state.mousebutton_was_released = false;
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown"){
			this.state.state = 0;
			this.state.mousedown_when = this.state.time;
			this.state.mousePressCooldown = 0.1 - (this.state.mousePressCooldown > 0 ? this.state.mousePressCooldown : 0);
		}else if(e.type == "mouseup"){
			this.state.mouseup_when = this.state.time;
			this.state.mousePressCooldown = 0.1 - (this.state.mousePressCooldown > 0 ? this.state.mousePressCooldown : 0);
			this.state.mousebutton_was_released = true;
		}
	},

	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameTelegraph );

