var SPECTATORSTAGE = {
	name: "spectator",

	to_load: [],
	game: null,
	game_canvas: null,
	
	users: [],
	users_by_id: {},
	
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
	
		if( this.spectating_author == -1 || !this.game )
		{
			//draw noise
			ctx.fillStyle = "white";
			ctx.font = "16px pixel";
			ctx.textAlign = "center";
			var msg = this.bad_version ? (" BAD VERSION " + this.spectating_author ) : " NO SIGNAL... ";
			ctx.fillText(msg, canvas.width * 0.5, canvas.height * 0.5 );	
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
		ctx.fillText(" spectating " + this.spectating_author + "["+this.users.length+"]", 0,10 );	
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

		//control new users and leaves			
		if( data.type == "game_state")
		{
			if(!this.users_by_id[ author_id ])
				this.onNewUser( author_id, data );	
		}
		if( data.type == "game_left" )
			this.onUserLeave( author_id );
			
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
			this.users_by_id[ author_id ].last_data = data;
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
	
	onNewUser: function( author_id, game_data )
	{
		var user = {
			id: author_id,
			last_data: game_data
		};
		this.users.push( user );
		this.users_by_id[ author_id ] = user;
	},
	
	onUserLeave: function( author_id )
	{
		if( this.spectating_author == author_id )
			this.spectating_author = -1;
		//remove			
		var user = this.users_by_id[ author_id ];
		var index = this.users.indexOf( user );
		if( index != -1 )
			this.users.splice( index, 1 );
		delete this.users_by_id[ author_id ];
	},
	
	onClientConnected: function( author_id )
	{
	},
	
	onClientDisconnected: function( author_id )
	{
		console.log("author leave");
		this.onUserLeave( author_id );
	},
	
	nextClient: function()
	{
		if( this.users.length <= 1 ) //nothing to do
			return;
			
		if( this.spectating_author == - 1)
		{
			this.spectating_author = this.users[0].id;
			return;
		}
		
		var user = this.users_by_id[ this.spectating_author ];
		if(!user)
			return;
		var index = this.users.indexOf( user );
		index = (index + 1) % this.users.length;
		user = this.users[ index ];
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
				case 27: APP.changeStage( MENUSTAGE ); return; break;
				case 90: GAMES.saveGameState(); return; break;
				case 88: GAMES.loadGameState(); return; break;
				case 32: this.nextClient(); return; break;
				default:
			}
		}		
		else
		{
		}
	}
};

APP.registerStage( SPECTATORSTAGE );

