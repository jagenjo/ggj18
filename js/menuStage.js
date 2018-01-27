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
		ctx.font = "14px pixel";
		for(var i = 0; i < GAMES.games.length; ++i )
		{
			var game = GAMES.games[i];
			ctx.fillText( (this.selected == i ? "> " : "") + game.name.toUpperCase(), 10, y );
			y += 20;
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
		
	},
	
	onKey: function( e )
	{
		if(e.keyCode == 38 )
			this.selected--;
		if(e.keyCode == 40 )
			this.selected++;
		if(e.keyCode == 13 )
			this.selectGame( GAMES.games[ this.selected ] );
		this.selected = Math.clamp( this.selected, 0, GAMES.games.length - 1 );
	}
};

APP.registerStage( MENUSTAGE );
