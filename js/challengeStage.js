var CHALLENGESTAGE = {
	name: "challenge",

	to_load: [],
	game: null,
	game_canvas: null,
	exit_stage: null,
	
	server_id: -1,
	game_state: 0,
	player_ids: [],
	level: 0,
	inside_game: false,
	
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
		if(this.inside_game)
			return;
			
		NETWORK.listening_stage = this;
		NETWORK.sendEvent({ type: "player_join" });
		this.player_ids.length = 0;
		this.level = 0;
	},
	
	onLeave: function()
	{
		if(this.inside_game)
			return;
			
		NETWORK.sendEvent({ type: "player_left" }); 
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		
		ctx.fillStyle = "#2F4";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		
		//msg
		var msg = "waiting for server...";
		if(this.player_ids.length)
			msg = "players connected: " + this.player_ids.length;
			
		ctx.fillStyle = "white";
		ctx.font = "16px pixel";
		ctx.textAlign = "center";
		ctx.fillText( msg, canvas.width * 0.5, canvas.height * 0.5 );	
		ctx.textAlign = "left";
	
		//id				
		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText( " " + NETWORK.id, 0,12 );	
	},
	
	onUpdate: function( dt )
	{
	},
	
	onServerMessage: function( author_id, data )
	{
		var that = this;
		if( author_id != NETWORK.spectator_id ) //intra user messages
			return;
		
		if( data.type == "match_info" )
		{
			this.player_ids = data.players;
		}
		else if( data.type == "match_start" )
		{
			this.server_id = Number(author_id);
			this.level = 0;
			this.onMatchPlay( {} );
		}
		else if( data.type == "match_play" )
		{
			this.onMatchPlay( data );
		}
		else if( data.type == "match_canceled" )
		{
			APP.changeStage( MENUSTAGE );
			return;
		}
	},
	
	onMatchPlay: function(data)
	{
		var game = null;
		if( data.game_name )
			game = data.game_name;
		else
			game = GAMES.games[ data.level || this.level ];
		
		if( this.level >= GAMES.games.length )
		{
			NETWORK.sendEvent({ type: "player_won" }, this.server_id );
			this.game_state = 2;
			return;
		}
		
		GAMES.launchGame( game );
	
		PLAYSTAGE.onGameCompleted = this.onGameCompleted.bind(this);
		this.inside_game = true;
		APP.changeStage( PLAYSTAGE );
	},
	
	onGameCompleted: function( score )
	{
		APP.changeStage( CHALLENGESTAGE );
		this.inside_game = false;
		this.level += 1;
		NETWORK.sendEvent({ type: "game_completed" }, this.server_id );
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
				case 27: APP.changeStage( this.exit_stage || MENUSTAGE ); return; break;
				default:
			}
		}		
		else
		{
		}
	}
};

APP.registerStage( CHALLENGESTAGE );

