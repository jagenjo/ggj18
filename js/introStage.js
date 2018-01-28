var INTROSTAGE = {
	name: "intro",
	to_load: ["data/tower/credits.png"],

	init: function()
	{
	},

	onEnter: function()
	{
	},
	
	onRender: function( canvas, ctx )
	{
		ctx.drawImage( APP.assets["data/tower/credits.png"],0,0);
	},
	
	onUpdate: function( dt )
	{
	
	},
	
	onMouse: function(e)
	{
		if(e.type == "mousedown")
			APP.changeStage( MENUSTAGE );
	}
};

APP.registerStage( INTROSTAGE );

