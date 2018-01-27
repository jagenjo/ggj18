var GAMES = {

	gameClasses: {},
	current_game: null,
	
	init: function()
	{
		//init all
		for(var i in this.gameClasses )
		{
			var game = this.gameClasses[i];
			game.init();
		}
		
	},
	
	registerGame: function( game )
	{
		if(!game.name)
			throw("game without name");
		this.gameClasses[ game.name ] = game;
	},
	
	launchGame: function( name )
	{
		var game = this.gameClasses[ name ];
		if(!game)
			throw("game not found: " + name );
		
		if(this.current_game)
		{
			if(this.current_game.onFinish)
				this.current_game.onFinish();
		}
			
		this.current_game = game;
		game.start();
	}
};