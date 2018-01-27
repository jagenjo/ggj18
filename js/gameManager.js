var GAMES = {

	games: [],
	gameClasses: {},
	current_game: null,
	game_canvas: null,
	
	init: function()
	{
		this.game_canvas = document.createElement("canvas");
		this.game_canvas.width = 256;
		this.game_canvas.height = 224;
	
		//init all
		for(var i in this.gameClasses )
		{
			var game = this.gameClasses[i];
			if(game.onInit)
				game.onInit();
		}
	},
	
	registerGame: function( game )
	{
		if(!game.name)
			throw("game without name");
		this.gameClasses[ game.name ] = game;
		if(!game.scale)
			game.scale = 1;
		this.games.push( game );
	},
	
	renderGame: function( game, screen )
	{
		this.game_canvas.width = screen.width / screen.scale;
		this.game_canvas.height = screen.height / screen.scale;
		if( game.onRender )
			game.onRender( this.game_canvas );	
		return this.game_canvas;
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
	},
	
	playSound: function( filename, volume, skip_send, force_play )
	{
		//play local only if you are playing or comes from the server (no if you are spectating)
		if( PLAYSTAGE.active || force_play )
		{
			volume = volume || 0.5;
			var audio = new Audio();
			audio.src = filename;
			audio.loop = false;
			audio.volume = volume;
			audio.play();
		}
		
		//play in spectators
		if( !skip_send )
			NETWORK.sendEvent( { type:"game_event", action: "play_sound", filename: filename, volume: volume } );
	}
};