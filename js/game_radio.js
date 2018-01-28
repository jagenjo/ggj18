
var GameRadio = {
	name: "radio",
	version: 0.1,
	
	scale: 1,
	to_load: ["data/radio/radio_bg.png","data/radio/radio_fg.png","data/radio/radio_led_good.png","data/radio/radio_led.png"],
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		win_time: -1,
		freq: 90,
		accuracy: 0,
		solved: 0,
		solution: 30,
		remaining_time: 1
	},
	
	smooth_freq: 90,
	
	//called after loading all games, init stuff here
	onInit: function()
	{
		this.audio_static = new Audio();
		this.audio_static.src = "data/radio/static.mp3";
		this.audio_static.loop = true;
		this.audio_static.autoplay = false;
		this.audio_static.volume = 0.0;
		this.audio_morse = new Audio();
		this.audio_morse.src = "data/radio/mayday.mp3";
		this.audio_morse.loop = true;
		this.audio_morse.autoplay = false;
		this.audio_morse.volume = 0.0;
	},
	
	//when starting to show this game
	onEnter: function()
	{
		this.audio_static.play();
		this.audio_morse.play();
	},
	
	//when ending showing this game
	onLeave: function()
	{
		this.audio_static.pause();
		this.audio_morse.pause();
	},
	
	
	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
		this.state.win_time = -1;
		this.state.freq = 100;
		this.state.solved = 0;
		this.state.accuracy = 0;
		this.state.solution = Math.random() > 0.5 ? 180 - Math.random() * 40 :  Math.random() * 40;
		this.state.remaining_time = 1;
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");


		ctx.drawImage( APP.assets["data/radio/radio_bg.png"],0,0);
		
		if( this.state.remaining_time < 0 ){
			ctx.fillStyle = "black";
			ctx.globalAlpha = 0.75;
			ctx.fillRect(0,0,canvas.width,canvas.height);
			ctx.globalAlpha = 1;
		}
		
		ctx.save();
		ctx.translate(118,157);
		ctx.rotate( this.smooth_freq * DEG2RAD );
		this.smooth_freq = this.smooth_freq * 0.8 + (this.state.freq + Math.random()) * 0.2;
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.lineTo(-200,0);
		ctx.stroke();
		ctx.restore();
		
		ctx.drawImage( APP.assets["data/radio/radio_fg.png"],0,0);
		
		ctx.globalAlpha = ( this.state.accuracy < 0.8 ? this.state.accuracy : 1.0 ) * 0.8 + Math.random() * 0.2 * this.state.accuracy;
		ctx.drawImage( APP.assets[ this.state.accuracy < 0.9 ? "data/radio/radio_led.png" : "data/radio/radio_led_good.png"],0,0);
		ctx.globalAlpha = 1;
		
		//ctx.fillStyle = "cyan";
		//ctx.fillText( this.state.freq.toFixed(1) + " - " + this.state.solution.toFixed(1), 30,30 );
		
		if(this.state.win_time == -1 )
		{
			ctx.fillStyle = "cyan";
			ctx.fillRect( 0, canvas.height - 4, canvas.width * this.state.remaining_time, 4 );
		}
		
		if(this.state.remaining_time > 0.8 )
		{
			ctx.lineWidth = 2;
			ctx.font = "16px pixel";
			ctx.textAlign = "center";
			ctx.strokeStyle = "black";
			ctx.fillStyle = "white";
			ctx.strokeText( "FIND THE SIGNAL", canvas.width * 0.5, canvas.height * 0.25 );
			ctx.fillText( "FIND THE SIGNAL", canvas.width * 0.5, canvas.height * 0.25 );
			ctx.textAlign = "left";
			ctx.lineWidth = 1;
		}
		
		if(this.state.win_time > 0 )
		{
			ctx.font = "32px pixel";
			ctx.textAlign = "center";
			ctx.fillStyle = "gray";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*4-2, canvas.height * 0.5 + Math.random()*4-2 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.textAlign = "left";
		} 
		
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if( this.state.win_time == -1 )
			this.state.remaining_time -= dt * 0.2;
	
		if( this.state.remaining_time >= 0 ){
			this.state.accuracy = Math.max( 0, 1.0 - Math.abs( this.state.freq - this.state.solution ) / 10 );
			this.state.accuracy = Math.clamp( this.state.accuracy, 0, 1);
			var f = Math.pow( this.state.accuracy, 1.2 );
			this.audio_static.volume = (1.0 - f) * 0.5;
			this.audio_morse.volume = f * 0.5;
		}
		else
		{
			this.audio_static.volume = 0;
			this.audio_morse.volume = 0;
		}
		
		if( this.state.remaining_time < -0.2 )
			this.onStart();
		
		if( this.state.accuracy > 0.8 )
			this.state.solved += dt * 0.75;
		else
			this.state.solved = Math.max(0, this.state.solved - dt*0.5);

		if( this.state.win_time == -1 && this.state.solved > 1.0 )
			this.state.win_time = this.state.time;
	
		if( this.state.win_time != -1 && ( this.state.win_time + 2 ) < this.state.time && this.state.time > 2)
			GAMES.playerWin();
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousemove" && e.dragging && this.state.win_time == -1 )
		{
			this.state.freq += (e.deltax) * 0.1;
			this.state.freq = Math.clamp( this.state.freq, 0, 180 );
		}
	}
};

//register in DB
GAMES.registerGame( GameRadio );

