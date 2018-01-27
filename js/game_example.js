//API CALLS
//GAME.finish(score) //to finish

var GameExample = {
	name: "test",
	version: 0.1,
	
	scale: 5,
	to_load: [], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_was_pressed: false,
		blips: [],
		win: -1,
		volume: 0.0
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
		this.audio = new Audio();
		this.audio.src = "data/telegraph/beep.mp3";
		this.audio.loop = true;
		this.audio.autoplay = false;
		this.audio.volume = 0.0;
	},
	
	//when starting to show this game
	onEnter: function()
	{
		this.audio.play();
	},
	
	//when ending showing this game
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
		this.state.win = -1;
		this.state.blips.length = 0;
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
			if( this.state.blips.length > 4 )
				this.state.win = this.state.time;
			GAMES.playSound("data/sounds/water.wav",0.5);
		}
	},
	
	//called when moving to other game
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameExample );

