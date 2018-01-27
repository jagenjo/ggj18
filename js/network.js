var NETWORK = {
	server: null,
	id: -1,
	ticks_send: 10,
	ticks: 0,
	
	init: function()
	{
		this.id = ( getTime() + ((Math.random() * 1000)|0)).toString();
	
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
			
		var msg = {
			type: "game_state",
			game_name: game.name,
			version: game.version,
			state: game.state
		};
		this.send( msg );
	},
	
	sendEvent: function( event )
	{
		this.send( event );
	},
	
	onReady: function()
	{
		console.log("server ready");
	},
	
	onClientConnected: function(author_id)
	{
		SPECTATORSTAGE.onClientConnected( author_id );
	},
	
	onMessage: function( author_id, data )
	{
		var d = JSON.parse(data);
		if( SPECTATORSTAGE.active )
			SPECTATORSTAGE.onServerMessage( author_id, d );
	},

	onClientDisconnected: function(author_id)
	{
		SPECTATORSTAGE.onClientDisconnected( author_id );
	},

	onClose: function()
	{
		console.log("server closed");
		setTimeout( function(){ 
			NETWORK.server.connect("tamats.com:55000","ggj18");
		},2000);
	},
	
	send: function(msg)
	{
		this.server.sendMessage( msg );
	}
};