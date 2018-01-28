var MENUSTAGE = {
	name: "menu",
	selected: 0,
	
	options:[
		"TRAINING",
//		"SPECTATE",
		"COMPETE",
		"HOST"
	],

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
		ctx.fillText( "CHOOSE OPTION", 10, y );
		y += 30;
		
		ctx.fillStyle = "#345";
		ctx.fillRect( 5, y + this.selected * 24 - 24, 200, 26 );

	
		for(var i = 0; i < this.options.length; ++i )
		{
			var option = this.options[i];
			ctx.fillStyle = (this.selected == i ? "white" : "black" );
			ctx.fillText( (this.selected == i ? "] " : "") + option, 20, y );
			y += 24;
		}
		ctx.globalAlpha = 1; 
	},
	
	selectOption: function( option )
	{
		if(option == "TRAINING")
			APP.changeStage( TRAININGSTAGE );
		else if(option == "SPECTATE")
			APP.changeStage( SPECTATORSTAGE );
		else if(option == "COMPETE")
			APP.changeStage( CHALLENGESTAGE );
		else if(option == "HOST")
			APP.changeStage( TOWERSTAGE );		
	},
	
	onUpdate: function( dt )
	{
	
	},
	
	onMouse: function( e )
	{
		var i = Math.clamp( Math.floor((e.mousey/2 - 40) / 24), 0, this.options.length - 1);
		if( e.type == "mousedown" )
		{
			this.selectOption( this.options[ this.selected ] );
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
			if(e.keyCode == 80 ) //P
				APP.changeStage( SPECTATORSTAGE );
			if(e.keyCode == 38 )
				this.selected--;
			if(e.keyCode == 40 )
				this.selected++;
			if(e.keyCode == 27 )
				APP.changeStage( INTROSTAGE );
			if(e.keyCode == 13 )
				this.selectOption( this.options[ this.selected ] );
			this.selected = Math.clamp( this.selected, 0, this.options.length - 1 );
		}
	}
};

APP.registerStage( MENUSTAGE );

