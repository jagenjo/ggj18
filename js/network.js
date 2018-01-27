var NETWORK = {
	server: null,
	
	init: function()
	{
		this.server = new SillyClient();
		this.server.connect("tamats.com:55000","ggj18");
		this.server.on_ready = this.onReady.bind(this);
		this.server.on_message = this.onMessage.bind(this);
		this.server.on_close = this.onClose.bind(this);
		this.server.on_error = function(err){
			console.error("error connecting...",err);
		};
	},
	
	onReady: function()
	{
		console.log("server ready");
	},
	
	onMessage: function(data)
	{
		var d = JSON.parse(data);
		
	},

	onClose: function()
	{
	
	},
	
	send: function(msg)
	{
		this.server.sendMessage( msg );
	}
};