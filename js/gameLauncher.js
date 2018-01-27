var GAMES = {

	games: [],
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
		this.games.push( game );
	},
	
	launchGame: function( game )
	{
		if( game && game.constructor === String )
			game = this.gameClasses[ game ];
		if(!game)
			throw("game not found: " + name );
		
		if(this.current_game)
		{
			if(this.current_game.onFinish)
				this.current_game.onFinish();
		}
			
		this.current_game = game;
		PLAYSTAGE.game = game;
		game.start_time = getTime();
		if(game.onStart)
			game.onStart();
	}
};