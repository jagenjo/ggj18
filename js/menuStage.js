var MENUSTAGE = {
	name: "menu",
	selected: 0,

	onInit: function()
	{
	},

	onEnter: function()
	{
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		
		ctx.fillStyle = "white";
		var y = 30;
		ctx.font = "16px pixel";
		ctx.fillText( "SELECT GAME", 10, y );
		y += 30;
	
		for(var i = 0; i < GAMES.games.length; ++i )
		{
			var game = GAMES.games[i];
			ctx.fillText( (this.selected == i ? "] " : "") + game.name.toUpperCase(), 20, y );
			y += 24;
		}
	},
	
	selectGame: function( game )
	{
		GAMES.launchGame( game );
		APP.changeStage( PLAYSTAGE );
		
	},
	
	onUpdate: function( dt )
	{
	
	},
	
	onMouse: function( e )
	{
		return;
		
		var i = Math.floor((e.posy - 20) / 24);
		if( e.type == "mousedown" )
		{
			var game = GAMES.games[i];
			if(game)
				this.selectGame(game);
		}
		else if( e.type == "mousemove" )
		{
			this.selected = i;
		}
	},
	
	onKey: function( e )
	{
		if( e.type == "keydown" )
		{
			if(e.keyCode == 80 )
				APP.changeStage( SPECTATORSTAGE );
			if(e.keyCode == 38 )
				this.selected--;
			if(e.keyCode == 40 )
				this.selected++;
			if(e.keyCode == 13 )
				this.selectGame( GAMES.games[ this.selected ] );
			this.selected = Math.clamp( this.selected, 0, GAMES.games.length - 1 );
		}
	}
};

APP.registerStage( MENUSTAGE );

