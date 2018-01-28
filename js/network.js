var NETWORK = {
	server: null,
	id: -1,
	ticks_send: 10,
	ticks: 0,
	
	filter_traffic: true,
	spectator_id: -1,
	
	users: [],
	users_by_id: {},
	
	listening_stage: null,
	
	init: function()
	{
		this.server = new SillyClient();
		this.server.connect("tamats.com:55000","ggj18");
		this.server.on_ready = this.onReady.bind(this);
		this.server.on_message = this.onMessage.bind(this);
		this.server.on_user_connected = this.onClientConnected.bind(this);
		this.server.on_user_disconnected = this.onClientDisconnected.bind(this);
		this.server.on_close = this.onClose.bind(this);
		this.server.on_error = function(err){
			console.error("error connecting...",err);
		};
	},
	
	sendGameState: function( game )
	{
		this.ticks++;
		if( (this.ticks % this.ticks_send) != 0 )
			return;
			
		if( !PLAYSTAGE.active )
			return;
			
		var msg = {
			type: "game_state",
			game_name: game.name,
			version: game.version,
			state: game.state
		};
		
		if( !this.filter_traffic )
			this.send( msg );
		else
			if( this.spectator_id != -1 ) 
				this.send( msg, this.spectator_id );
	},
	
	sendEvent: function( event, target_id )
	{
		this.send( event, target_id );
	},
	
	onReady: function(id)
	{
		this.id = id;
		console.log("server ready");
	},
	
	onClientConnected: function(author_id)
	{
		if( this.is_spectator )
			this.server.sendMessage( { type: "request_spectator" }, author_id );

		if( this.listening_stage && this.listening_stage.onClientConnected )
			this.listening_stage.onClientConnected( author_id );
	},
	
	onMessage: function( author_id, d )
	{
		var data = JSON.parse(d);
		
		if( data.type == "request_spectator" )
		{
			this.spectator_id = Number(author_id);
			return;
		}
				
		if( data.type == "game_left" )
		{
			this.onUserLeave( author_id );
			return;
		}
		
		if( data.type == "game_state")
		{
			if(!this.users_by_id[ author_id ])
				this.onNewUser( author_id, data );	
			this.users_by_id[ author_id ].last_data = data;
		}
			
			
		
		if( this.listening_stage && this.listening_stage.active && this.listening_stage.onServerMessage )
			this.listening_stage.onServerMessage( author_id, data );
	},

	onClientDisconnected: function(author_id)
	{
		if( this.listening_stage && this.listening_stage.onClientDisconnected )
			this.listening_stage.onClientDisconnected( author_id );
	},

	onClose: function()
	{
		console.log("server closed");
		setTimeout( function(){ 
			NETWORK.server.connect("tamats.com:55000","ggj18");
		},2000);
	},
	
	send: function( msg, target_id )
	{
		//this.server.sendMessage( msg );
		this.server.sendMessage( msg, target_id );
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
		if( this.listening_stage && this.listening_stage.onUserLeave )
			this.listening_stage.onUserLeave( author_id );
			
		//remove			
		var user = this.users_by_id[ author_id ];
		var index = this.users.indexOf( user );
		if( index != -1 )
			this.users.splice( index, 1 );
		delete this.users_by_id[ author_id ];
	},	
	
	requestSpectator: function()
	{
		this.is_spectator = true;
		this.server.sendMessage( { type: "request_spectator" } );
	}
};