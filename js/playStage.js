var PLAYSTAGE = {
	name: "play",

	to_load: [ "data/fondo.png" ],
	
	onInit: function()
	{
	},

	onEnter: function()
	{
	},
	
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");

		ctx.drawImage( APP.assets["data/fondo.png"],0,0);

		ctx.fillStyle = "white";
		ctx.font = "14px Arial";
		ctx.fillText(" playing ... ", 20,20 );	
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.moveTo(40,40);
		ctx.lineTo(100,100);
		ctx.stroke();
	},
	
	onUpdate: function( dt )
	{
	
	}
};

APP.registerStage( PLAYSTAGE );

