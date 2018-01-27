var SPECTATORSTAGE = {
	name: "spectator",

	to_load: [],
	game: null,
	game_canvas: null,
	
	spectating_author: -1,
	
	screen: {
		x: 32,
		y: 8,
		width: 256,
		height: 224,
		scale: 2
	},
	
	onInit: function()
	{
	},

	onEnter: function()
	{
		
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
	
		if( this.spectating_author == -1 )
		{
			//draw noise
			ctx.fillStyle = "white";
			ctx.font = "16px pixel";
			ctx.textAlign = "center";
			ctx.fillText(" NO SIGNAL... ", canvas.width * 0.5, canvas.height * 0.5 );	
			ctx.textAlign = "left";
			return;
		}
	
		if(!this.game)
			return;
		
		this.screen.scale = this.game.scale;
		var game_canvas = GAMES.renderGame( this.game, this.screen );

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage( game_canvas, this.screen.x, this.screen.y, this.screen.width, this.screen.height );

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText(" spectating " + this.spectating_author, 0,10 );	
	},
	
	onUpdate: function( dt )
	{
		//if local
		if(!this.game)
			return;
			
		this.game.state.time += dt;
		if( this.game.onUpdate )
			this.game.onUpdate(dt);
	},
	
	onServerMessage: function(author_id, data)
	{
		if( this.spectating_author == -1 )
			this.spectating_author = author_id;
			
		if( this.spectating_author != author_id )
			return;
			
		this.game = GAMES.gameClasses[ data.game_name ];
		if(this.game)
		{
			//this.game.start_time = data.start_time;
			this.game.state = data.state;
		}
	},
	
	onClientConnected: function( author_id )
	{
	},
	
	onClientDisconnected: function( author_id )
	{
		console.log("author leave");
		if( this.spectating_author == author_id )
			this.spectating_author = -1;
	},
	
	onMouse: function(e)
	{
	},
	
	onKey: function(e)
	{
		if ( e.type == "keydown")
		{
			switch( e.keyCode )
			{
				case 27: APP.changeStage( MENUSTAGE ); return; break;
				case 90: GAMES.saveGameState(); return; break;
				case 88: GAMES.loadGameState(); return; break;
				default:
			}
		}		
		else
		{
		}
	}
};

APP.registerStage( SPECTATORSTAGE );

