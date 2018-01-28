var TRAININGSTAGE = {
	name: "training",
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
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = "black";
		var y = 30;
		
		ctx.globalAlpha = Math.clamp( getTime() * 0.001 - this.start_time, 0,1 ); 
		ctx.font = "16px pixel";
		ctx.fillText( "SELECT GAME", 10, y );
		y += 30;
		
		ctx.fillStyle = "#543";
		ctx.fillRect( 5, y + this.selected * 24 - 24, 300, 26 );
	
		for(var i = 0; i < GAMES.games.length; ++i )
		{
			var game = GAMES.games[i];
			ctx.fillStyle = (this.selected == i ? "white" : "black" );
			ctx.fillText( (this.selected == i ? " " : "") + game.name.toUpperCase(), 20, y );
			y += 24;
		}
		ctx.globalAlpha = 1; 
	},
	
	selectGame: function( game )
	{
		GAMES.launchGame( game );
		
		PLAYSTAGE.onGameCompleted = function( score ) {
			APP.changeStage( TRAININGSTAGE );
		}
		PLAYSTAGE.exit_stage = this;
		APP.changeStage( PLAYSTAGE );
	},
	
	onUpdate: function( dt )
	{
	
	},
	
	onMouse: function( e )
	{
		var i = Math.clamp( Math.floor((e.mousey/2 - 30) / 24), 0, GAMES.games.length - 1);
		
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
			if(e.keyCode == 27 )
				APP.changeStage( MENUSTAGE );
			if(e.keyCode == 13 )
				this.selectGame( GAMES.games[ this.selected ] );
			this.selected = Math.clamp( this.selected, 0, GAMES.games.length - 1 );
		}
	}
};

APP.registerStage( TRAININGSTAGE );

