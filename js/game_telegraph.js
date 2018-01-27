//API CALLS
//GAME.finish(score) //to finish

var GameTelegraph = {
	name: "telegraph",
	scale: 2,
	to_load: ["data/telegraph/sprite_1.png", "data/telegraph/sprite_2.png", "data/telegraph/sprite_3.png"], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		background: 0,
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		mousebutton_was_pressed: false,	//updated outside
		mousebutton_was_released: false,
		mousePressCooldown: 0,
		morse: "--. .- -- .",
		morseProgress: 0,
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
	},
	
	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
		this.audio = new Audio();
		this.audio.autoplay = false;
		this.audio.src = "data/telegraph/beep.mp3";
		this.audio.loop = true;
		this.audio.volume = 0;
		this.audio.play();
	},

	drawMorse: function( ctx, code, x, y )
	{
		var ax = x;
		for(var i in code){
			var c = code[i];
			if(i == this.state.morseProgress){
				ctx.strokeStyle = "red";
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

		this.drawMorse(ctx, this.state.morse, 50, 20);
	},

	checkMorse()
	{
		var m;
		if(this.state.mousebutton_was_released){
			var t = this.state.time - this.state.mousedown_when;
			if(t < 0.5) m = ".";
			else m = "-";
		}else if(this.state.mousebutton_was_pressed){
			var t = this.state.time - this.state.mouseup_when;
			if(t > 0.5) m = " ";
		}

		if(m == this.state.morse[this.state.morseProgress]) this.state.morseProgress += 1;

		if(m == "." || m == "-" || m == " ") console.log(t, m);
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if(dt > 1) dt = 1;

		this.checkMorse();

		if(this.state.mousedown){
			this.audio.volume = 0.5;
			this.state.background = this.state.mousePressCooldown > 0 ? 1 : 2;
		}else{
			if(this.state.mousePressCooldown <= 0){
				this.audio.volume = 0;
				this.state.background = 0;
			}else{
				this.state.background = 1;
			}
		}

		this.state.mousePressCooldown -= dt;
		this.state.mousebutton_was_released = false;
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown"){
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

