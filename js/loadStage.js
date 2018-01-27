var LOADSTAGE = {
	name: "load",

	loading: -1,
	
	init: function()
	{
	},

	onEnter: function()
	{
		var to_load = [];

		for(var i in APP.stages )
		{
			var stage = APP.stages[i];
			if(stage.to_load)
				to_load = to_load.concat( stage.to_load );
		}
		
		for(var i in GAMES.gameClasses )
		{
			var game = GAMES.gameClasses[i];
			if(game.onInit)
				game.onInit();
			if(game.to_load)
				to_load = to_load.concat( game.to_load );
		}
		
		if( to_load.length )
			this.loadAssets( to_load, this.ready.bind(this) );
		else
			this.ready();
	},
	
	ready: function()
	{
		APP.changeStage( MENUSTAGE );
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "white";
		ctx.fillText(" loading ... " + this.loading, 20,20 );	
		
	},
	
	onUpdate: function( dt )
	{
	
	},

	loadAssets: function( to_load, on_ready )
	{
		var that = this;
		var total = to_load.length;
		var pending = total;
		this.loading = 0;
		
		//load all
		for(var i = 0; i < to_load.length; ++i)
		{
			var filename = to_load[i];	
			if( APP.assets[ filename ] )
			{
				inner_load();
				continue;
			}
				
			var ext = filename.substr( filename.lastIndexOf(".") + 1 ).toLowerCase();
			if( ext == "jpg" || ext == "png" )
			{
				var img = new Image();
				img.src = filename;
				img.filename = filename;
				img.onload = inner_load;
				APP.assets[ filename ] = img;
			}
			else if( ext == "wav" || ext == "mp3" )
			{
				var audio = new Audio();
				audio.src = filename;
				audio.autoplay = false;
				audio.onload = inner_load;
				APP.assets[ filename ] = audio;
			}
			else
				throw("unknown file to load");
		}
		
		function inner_load()
		{
			pending--;
			if(pending <= 0)
				on_ready(that);
			else
				that.loading = 1.0 - (pending / total);
		}
	}
};

APP.registerStage( LOADSTAGE );

