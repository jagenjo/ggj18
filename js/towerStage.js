var TOWERSTAGE = {
	name: "tower",

	to_load: ["data/background_skyline.png", "data/tower/tv.png", "data/tower/background_tower.png" ],
	game: null,
	game_canvas: null,
	
	spectating_author: -1,
	state: 0, //waiting
	state_time: 0,
	
	players: [],
	players_by_id: {},
	player_ids: [],
	
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
		APP.canvas.width = 800;
		APP.canvas.height = 600;
		NETWORK.requestSpectator();
		NETWORK.listening_stage = this;
		
		this.players.length = 0;
		this.players_by_id = {};
		
		if(this.game && this.game.onEnter)
			this.game.onEnter();
	},
	
	onLeave: function()
	{
		APP.canvas.width = 400;
		APP.canvas.height = 300;
		if(this.game && this.game.onLeave)
			this.game.onLeave();
		this.broadcast({ type:"match_canceled" });
	},
	
	onRender: function( canvas, ctx )
	{
		//var ctx = canvas.getContext("2d");
		
		ctx.drawImage( APP.assets[ "data/background_skyline.png" ], 0, 0 );
		ctx.drawImage( APP.assets[ "data/tower/background_tower.png" ], 0, -600 );
		
		this.renderTV(ctx);

		ctx.fillStyle = "white";
		ctx.font = "16px pixel";

		if(this.state == 0)
		{
			var msg = "Waiting players... ";
			if( this.players.length > 0 )
				msg = "Players online: " + this.players.length;
			ctx.fillText( msg , 40, this.screen.y + this.screen.height + 70 );	
			
			if( this.players.length > 0 )
				ctx.fillText( "press SPACE to start" , 40, this.screen.y + this.screen.height + 100 );	
		}
		else if(this.state == 1)
		{
			ctx.fillText( "PLAYING" , 40, this.screen.y + this.screen.height + 70 );	
		}

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		//ctx.fillText(" spectating " + this.spectating_author + "["+NETWORK.users.length+"]", 0,10 );	
	},
	
	renderTV: function(ctx)
	{
		ctx.fillStyle = "black";
		ctx.fillRect( this.screen.x - 8, this.screen.y - 8, this.screen.width + 16, this.screen.height + 16);  
	
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
		
		ctx.drawImage( APP.assets[ "data/tower/tv.png" ], 0,0);
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
		//follow the first one
		//if( this.spectating_author == -1 )
		//	this.spectating_author = author_id;
						
		if( this.spectating_author == author_id )
			this.onSpectatingMessage( author_id, data );

		if( data.type == "player_join")
		{
			this.addPlayer( author_id, data );
			this.broadcast( { type: "match_info", players: this.player_ids } );
		}
		else if( data.type == "player_left")
		{
			this.removePlayer( author_id );
		}
		else if( data.type == "game_completed")
		{
			var user = this.players_by_id[ author_id ];
			if(user)
			{
				user.level += 1;
				NETWORK.send( { type:"match_play", level: user.level }, author_id );
			}
		} 
	},
	
	onSpectatingMessage: function( author_id, data )
	{
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
		//invite him
	},
	
	onClientDisconnected: function( author_id )
	{
		console.log("author leave");
		this.onUserLeave( author_id );
		this.removePlayer( author_id );
	},
	
	startMatch: function()
	{
		this.broadcast({ type:"match_start" });
		this.state = 1;
	},
	
	onBeforeUnload: function()
	{
		this.broadcast({ type:"match_canceled" });
	},
	
	addPlayer: function( author_id, data )
	{
		var player = { 
			id: Number(author_id), 
			profile: data.profile,
			score: 0,
			level: 0
		};
		this.players.push( player );
		this.players_by_id[ author_id ] = player;
		this.player_ids.push( Number(author_id) );
	},
	
	removePlayer: function( author_id )
	{
		var player = this.players_by_id[ author_id ];
		if(player)
		{
			var index = this.players.indexOf( player );
			this.players.splice( index, 1 );
			this.player_ids.splice( index, 1 );
		}
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
	
	broadcast: function( msg )
	{
		NETWORK.send( msg, this.player_ids );
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
				case 27: APP.changeStage( MENUSTAGE ); return; break;
				case 32:
					if( this.state == 0 )
						this.startMatch();
					else
						this.nextClient();
					return;
					break;
				default:
			}
		}		
		else
		{
		}
	}
};

APP.registerStage( TOWERSTAGE );

