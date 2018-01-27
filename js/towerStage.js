var TOWERSTAGE = {
	name: "tower",

	to_load: ["data/background.png", "data/tower/tv.png"],
	game: null,
	game_canvas: null,
	
	spectating_author: -1,
	
	screen: {
		x: 32,
		y: 8,
		width: 256,
		height: 224,
		scale: 1
	},
	
	game_screen: {
		x: 32,
		y: 8,
		width: 256,
		height: 224,
		scale: 1
	},
	
	onInit: function()
	{
	},

	onEnter: function()
	{
		NETWORK.requestSpectator();
		NETWORK.listening_stage = this;
		if(this.game && this.game.onEnter)
			this.game.onEnter();
	},
	
	onLeave: function()
	{
		if(this.game && this.game.onLeave)
			this.game.onLeave();
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		
		ctx.drawImage( APP.assets[ "data/background.png" ], 0, 0 );
	
		if( this.spectating_author == -1 || !this.game )
		{
			//draw noise
			ctx.fillStyle = "white";
			ctx.font = "16px pixel";
			ctx.textAlign = "center";
			var msg = this.bad_version ? (" BAD VERSION " + this.spectating_author ) : " NO SIGNAL... ";
			ctx.fillText( msg, this.screen.x + this.screen.width * 0.5, this.screen.y + this.screen.height * 0.5 );	
			ctx.textAlign = "left";
		}
		else
		{
			this.game_screen.scale = this.game.scale;
			var game_canvas = GAMES.renderGame( this.game, this.game_screen );
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage( game_canvas, this.screen.x, this.screen.y, this.screen.width, this.screen.height );
		}
		
		ctx.drawImage( APP.assets[ "data/tower/tv.png" ], 0, 0 );

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		//ctx.fillText(" spectating " + this.spectating_author + "["+NETWORK.users.length+"]", 0,10 );	
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
			
		if( data.type == "game_event")
		{
			if( data.action == "play_sound" )
				GAMES.playSound( data.filename, data.volume, true, true );
			return;
		}			
			
		if( data.type == "game_state")
		{
			this.bad_version = false;
		
			//search game
			var game = GAMES.gameClasses[ data.game_name ];
			if( game && game.version == data.version )
			{
				if( this.game != game )
				{
					if( this.game )
					{
						if(this.game.onLeave)
							this.game.onLeave();
					}
					this.game = game;
					if(game.onEnter)
						game.onEnter();
				}
				//this.game.start_time = data.start_time;
				this.game.state = data.state;
			}
			else //game not found
			{
				if( game && game.version != data.version )
					this.bad_version = true;
				if(this.game)
				{
					if( this.game.onLeave )
						this.game.onLeave();
					this.game = null;
				}
			}
		}
	},
	
	onClientConnected: function( author_id )
	{
	},
	
	onClientDisconnected: function( author_id )
	{
		console.log("author leave");
		this.onUserLeave( author_id );
	},
	
	onUserLeave: function( author_id )
	{	
		if( this.spectating_author == author_id )
		{
			this.spectating_author = -1;
			if(this.game && this.game.onLeave)
				this.game.onLeave();
			this.game = null;
		}
	},
	
	nextClient: function()
	{
		if( NETWORK.users.length <= 1 ) //nothing to do
			return;
			
		if( this.spectating_author == - 1)
		{
			this.spectating_author = NETWORK.users[0].id;
			return;
		}
		
		var user = NETWORK.users_by_id[ this.spectating_author ];
		if(!user)
			return;
		var index = NETWORK.users.indexOf( user );
		index = (index + 1) % NETWORK.users.length;
		user = NETWORK.users[ index ];
		if(user)
		{
			var game = GAMES.gameClasses[ user.last_data.game_name ];
			if( game.version == user.last_data.version )
			{
				this.spectating_author = user.id;
			}
			else
				this.game = null;
		}
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
				case 32: this.nextClient(); return; break;
				default:
			}
		}		
		else
		{
		}
	}
};

APP.registerStage( TOWERSTAGE );

