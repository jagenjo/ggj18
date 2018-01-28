var PLAYSTAGE = {
	name: "play",

	to_load: [ "data/fondo.png" ],
	game: null,
	game_canvas: null,
	exit_stage: null,
	
	broadcast: true,
	onGameCompleted: null,
	onExitGame: null,
	
	screen: {
		x: 32,
		y: 8,
		width: 256,
		height: 224,
		scale: 2
	},
	
	onInit: function()
	{
	},
	
	onEnter: function()
	{
		this.screen.x = ((APP.canvas.width - this.screen.width) * 0.5)|0;
		this.screen.y = ((APP.canvas.height - this.screen.height) * 0.5)|0;
		
		if(!this.game)
			return;
			
		this.screen.scale = this.game.scale || 2;
		
		if(this.game.onEnter)
			this.game.onEnter();
		this.game.playing = true;
	},
	
	onLeave: function()
	{
		if(!this.game)
			return;
		if(this.game.onLeave)
			this.game.onLeave();
		this.game.playing = false;
		NETWORK.sendEvent( { type: "game_left", game_name: this.game.name }); 
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		
		if(!this.game)
		{
			ctx.fillStyle = "black";
			ctx.fillRect( this.screen.x, this.screen.y, this.screen.width, this.screen.height );
			ctx.font = "32px pixel";
			ctx.textAlign = "black";
			ctx.fillStyle = "white";
			ctx.fillText( "NO GAME SELECTED", canvas.width * 0.5 + Math.random()*4-2, canvas.height * 0.5 + Math.random()*4-2 );
			ctx.textAlign = "left";
			return;
		}

		//ctx.drawImage( APP.assets["data/fondo.png"],0,0);
		
		ctx.fillStyle = "white";
		ctx.fillRect( this.screen.x - 2, this.screen.y - 2, this.screen.width + 4, this.screen.height + 4 );
		
		var game_canvas = GAMES.renderGame( this.game, this.screen );
		if( game_canvas )
		{
			ctx.imageSmoothingEnabled = false;
			ctx.drawImage( game_canvas, this.screen.x, this.screen.y, this.screen.width, this.screen.height );
		}

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText( " " + NETWORK.id, 0,12 );	
	},
	
	onUpdate: function( dt )
	{
		if(!this.game)
			return;
			
		//if local
		this.game.state.time = ( getTime() - this.game.start_time ) * 0.001;
		if( this.game.onUpdate )
			this.game.onUpdate(dt);
		this.game.state.mousebutton_was_pressed = false;
		if(this.broadcast)
			NETWORK.sendGameState( this.game );
	},
	
	onMouse: function(e)
	{
		if(!this.game)
			return;
			
		if(e.type == "mousedown")
		{
			this.game.state.mousedown = true;
			this.game.state.mousebutton_was_pressed = true;
		}
		else 
		{
			if(e.type == "mouseup")
				this.game.state.mousedown = false;
		}
	
		e.posx = e.mousex / ( 2 ) - this.screen.x;
		e.posy = e.mousey / ( 2 ) - this.screen.y;
		e.posx /= this.screen.scale;
		e.posy /= this.screen.scale;
		if( e.type == "mousemove" || 
			(e.posx >= 0 && e.posx < this.screen.width &&
			e.posy >= 0 && e.posy < this.screen.height) )
		{
			if( this.game.onMouse )
				this.game.onMouse(e);
		}
	},
	
	onKey: function(e)
	{
		if ( e.type == "keydown")
		{
			switch( e.keyCode )
			{
				case 78: //N: debug
					if(this.game)
					{
						this.game.state.win_time = this.game.state.time;
						setTimeout( function(){ GAMES.playerWin(1); },1000);
						return;
					}
					break;
				case 27:
					if( this.onExitGame )
					{
						this.onExitGame();
						this.onExitGame = null;
					}
					else
						APP.changeStage( this.exit_stage || MENUSTAGE ); 
					return; 
					break;
//				case 90: GAMES.saveGameState(); return; break;
//				case 88: GAMES.loadGameState(); return; break;
				default:
			}
		}		
		else
		{
			if( this.game && this.game.onKey )
				this.game.onKey(e);
		}
	}
};

APP.registerStage( PLAYSTAGE );

