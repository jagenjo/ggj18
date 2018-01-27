
var GameRadio = {
	name: "radio",
	version: 0.1,
	
	scale: 5,
	to_load: [], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		win: -1,
		freq: 90,
		accuracy: 0,
		solution: 30
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
		this.audio_static = new Audio();
		this.audio_static.src = "data/radio/static.mp3";
		this.audio_static.loop = true;
		this.audio_static.autoplay = false;
		this.audio_static.volume = 0.0;
		this.audio_morse = new Audio();
		this.audio_morse.src = "data/radio/morse.mp3";
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
		this.state.win = -1;
		this.state.freq = 100;
		this.state.accuracy = 0;
		this.state.solution =  Math.random() * 40 + 10;
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect( 0,0, canvas.width, canvas.height );
		ctx.strokeStyle = "cyan";
		for(var i = 0; i < this.state.blips.length; ++i)
		{
			var blip = 	this.state.blips[i];
			ctx.globalAlpha = Math.max(0, 1.0 - (this.state.time - blip.time) * 0.5 );
			ctx.circle( blip.x, blip.y, (this.state.time - blip.time) * 10 );
			ctx.stroke();
		}
		ctx.globalAlpha = 1;
		
		if(this.state.win > 0 )
		{
			ctx.textAlign = "center";
			ctx.fillStyle = "gray";
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
		this.state.volume = Math.max( 0, this.state.volume - dt );
		this.audio.volume = this.state.volume;
		if( this.state.win != -1 && ( this.state.win + 2 ) < this.state.time && this.state.time > 2)
			GAMES.playerWin();
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" )
		{
			this.state.blips.push( { x: e.posx, y: e.posy, time: this.state.time } );
			if( this.state.win == -1 && this.state.blips.length > 4 )
				this.state.win = this.state.time;
			GAMES.playSound("data/sounds/water.wav",0.5);
		}
	}
};

//register in DB
GAMES.registerGame( GameRadio );

