var GameJelly = {
	name: "jelly",
	version: 0.3,
	
	scale: 2,
	to_load: ["data/jelly/jelly_background.png", "data/jelly/ggj17_player.png", "data/jelly/ggj17_jellyfish.png", "data/jelly/ggj17_referee.png"], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_was_pressed: false,
		distance: 70,
		force: 0,
		win_time: -1,
		dead: -1
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
	},
	
	//when starting to show this game
	onEnter: function()
	{
	},
	
	//when ending showing this game
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
		this.state.distance = 70;
		this.state.force = 0;
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");

		ctx.drawImage( APP.assets["data/jelly/jelly_background.png"],0,0 );		

		ctx.drawSprite( APP.assets["data/jelly/ggj17_referee.png"], -10,-10, Math.random() * 10, 64 );
		
		if( this.state.dead != -1 )
			ctx.drawSprite( APP.assets["data/jelly/ggj17_player.png"], 0,40, 8*4, 64 );
		else if( this.state.force > 0.2 )
			ctx.drawSprite( APP.assets["data/jelly/ggj17_player.png"], 0,40, 8*3+3.5+Math.random(), 64 );
		else
			ctx.drawSprite( APP.assets["data/jelly/ggj17_player.png"], 0,40, Math.random() * 10, 64 );

		ctx.drawSprite( APP.assets["data/jelly/ggj17_jellyfish.png"], 0 + Math.floor(this.state.distance),64, Math.random() * 10, 32 );
		
		if(this.state.win_time > 0 )
		{
			ctx.font = "16px pixel";
			ctx.textAlign = "center";
			ctx.fillStyle = "black";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.25 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.25 + Math.random()*2-1 );
			ctx.textAlign = "left";
		} 
		
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		this.state.force = Math.clamp( this.state.force - dt, 0, 1 );
		if( this.state.win_time != -1 && ( this.state.win_time + 2 ) < this.state.time && this.state.time > 2)
			GAMES.playerWin();
		
		if( this.state.distance > 80) //win
		{
			if( this.state.win_time == -1 )
				 this.state.win_time = this.state.time;
		}
		else if( this.state.dead == -1 && this.state.distance < 30) //kill
		{
			this.state.dead = this.state.time;
		}
		else //approach
		{	
			if( this.state.dead == -1 )
				this.state.distance -= dt * 13;
		}
		
		if( this.state.dead != -1 && (this.state.dead + 2) < this.state.time ) //restart	
		{
			this.state.dead = -1;
			this.state.distance = 70;
		}
		
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" )
		{
			this.state.distance += 5;
			this.state.force += 1;
			
			//if( this.state.win == -1 && this.state.blips.length > 4 )
			//	this.state.win = this.state.time;
			//GAMES.playSound("data/sounds/water.wav",0.5);
		}
	}
};

//register in DB
GAMES.registerGame( GameJelly );

