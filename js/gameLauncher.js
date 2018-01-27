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
	},
	
	saveGameState: function()
	{
		localStorage.setItem( "game_state", JSON.stringify( this.current_game.state ) );
	},
	
	loadGameState: function()
	{
		var state = localStorage.getItem( "game_state" );
		if(!state)
			return;
		var state = JSON.parse( state );
		this.current_game.start_time = getTime() - state.time * 1000;
		this.current_game.state = state;
	}
	
};