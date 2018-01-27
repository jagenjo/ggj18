var PLAYSTAGE = {
	name: "play",

	to_load: [ "data/fondo.png" ],
	game: null,
	game_canvas: null,
	
	screen: {
		x: 32,
		y: 8,
		width: 256,
		height: 224,
		scale: 4
	},
	
	onInit: function()
	{
		this.game_canvas = document.createElement("canvas");
		this.game_canvas.width = this.screen.width;
		this.game_canvas.height = this.screen.height;
	},

	onEnter: function()
	{
		this.game_canvas.width = this.screen.width / this.screen.scale;
		this.game_canvas.height = this.screen.height / this.screen.scale;
	},
	
	onRender: function( canvas )
	{
		if(!this.game)
			return;
		var ctx = canvas.getContext("2d");

		ctx.drawImage( APP.assets["data/fondo.png"],0,0);
		
		if( this.game.onRender )
			this.game.onRender( this.game_canvas );

		ctx.imageSmoothingEnabled = false;
		ctx.drawImage( this.game_canvas, this.screen.x, this.screen.y, this.screen.width, this.screen.height );

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText(" playing " + this.game.name, 0,10 );	
	},
	
	onUpdate: function( dt )
	{
		//if local
		this.game.state.time = ( getTime() - this.game.start_time ) * 0.001;
		if( this.game.onUpdate )
			this.game.onUpdate(dt);
	},
	
	onMouse: function(e)
	{
		e.posx = e.mousex / ( 2 ) - this.screen.x;
		e.posy = e.mousey / ( 2 ) - this.screen.y;
		e.posx /= this.screen.scale;
		e.posy /= this.screen.scale;
		if( e.posx >= 0 && e.posx < this.screen.width &&
			e.posy >= 0 && e.posy < this.screen.height )
		{
			if( this.game.onMouse )
				this.game.onMouse(e);
		}
	},
	
	onKey: function(e)
	{
		if( e.keyCode == 27 )
			APP.changeStage( MENUSTAGE );
		else
		{
			if( this.game.onKey )
				this.game.onKey(e);
		}
	}
};

APP.registerStage( PLAYSTAGE );

