
var GameOutrun = {
	name: "outrun",
	version: "miquel1",
	scale: 1,
	to_load: ["data/outrun/ball8.png", "data/outrun/boxgear.png", "data/outrun/car.png", "data/outrun/fondo.png", "data/outrun/police.png"], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_was_pressed: false,

		car: [],
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
	},

	onEneter: function()
	{

	},

	onLeave: function()
	{

	},
	
	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
	},

	drawRoad: function( ctx, ymin, ymax )
	{
		var y = ymin;
		var colors = ["#555555", "#888888"];
		var t = this.state.time;
		var v = 12;
		for(var i=0; y < ymax; i++){
			var h = Math.floor(Math.pow(i+(v*t) % 1, 1.2));

			ctx.fillStyle = colors[Math.floor(v*t + i)%2];
			ctx.fillRect(0, y, 300, h);
			y+= h;
		}

		ctx.fillStyle = "#81c137";
		ctx.beginPath();
		ctx.moveTo(0, ymin-1);
		ctx.lineTo(70, ymin);
		ctx.lineTo(0, ymax);
		ctx.fill();
		ctx.beginPath();
		ctx.moveTo(ctx.canvas.width, ymin-1);
		ctx.lineTo(ctx.canvas.width - 70, ymin);
		ctx.lineTo(ctx.canvas.width, ymax);
		ctx.fill();
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		ctx.drawImage( APP.assets["data/outrun/fondo.png"], 0, 0 );
		ctx.save();
		ctx.beginPath();
		ctx.rect(4, 60, 246, 121);
		ctx.clip();
		this.drawRoad(ctx, 100, 224);
		ctx.drawImage( APP.assets["data/outrun/police.png"], 100, 100 );
		ctx.drawImage( APP.assets["data/outrun/car.png"], 80, 140 );
		ctx.restore();
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( input_state )
	{
	},
	
	onMouse: function( e )
	{
	},
	
	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameOutrun );

