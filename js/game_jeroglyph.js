//API CALLS
//GAME.finish(score) //to finish

var GameJeroglyph = {
	version: 0.1,
	name: "teacher",
	scale: 2,
	to_load: ["data/jeroglyph/blackboard.png", "data/jeroglyph/teacher_1.png", "data/jeroglyph/teacher_2.png", "data/jeroglyph/teacher_3.png", "data/jeroglyph/teacher_4.png", "data/jeroglyph/circle.png", "data/jeroglyph/rombo.png", "data/jeroglyph/square.png", "data/jeroglyph/triangle.png"], //urls of images and sounds to load
	teacher: ["data/jeroglyph/teacher_1.png", "data/jeroglyph/teacher_2.png", "data/jeroglyph/teacher_3.png", "data/jeroglyph/teacher_4.png"],
	glyphs: [],

	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		win_time: -1,
		show_teaching: -1,
		sequence: "",
	},

	//called after loading all games, init stuff here
	onInit: function()
	{
	},

	onEnter: function()
	{
	},

	onLeave: function()
	{
	},

	sequence: function(){
		var s = "";
		for(var i=0; i<10; i++){
			var r = Math.floor(Math.random()*4);
			s += (r == 0 ? "c" : r == 1 ? "r" : r == 2 ? "t" : "s");
		}
		this.state.sequence = s;
	},
	
	restart: function(){
		this.state.win_time = -1;
		this.sequence();

	},

	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
		this.state.wins = 0;
		this.restart();
	},
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
		var ctx = canvas.getContext("2d");
		var w = canvas.width;
		var h = canvas.height;

		ctx.fillStyle = "#676767";
		ctx.fillRect(0,0,w,h);

		ctx.fillStyle = "white";
		ctx.font = "8px pixel";
		ctx.fillText("Learn!:", 10, 20);

		/*if(this.state.wins > 2 )
		{
			ctx.textAlign = "center";
			ctx.font = "16px pixel";
			ctx.fillStyle = "black";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.textAlign = "left";
		}else */if(this.state.win_time > 0){
			ctx.textAlign = "center";
			ctx.font = "16px pixel";
			ctx.fillStyle = "black";
			ctx.fillText( "HIT!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "HIT!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.textAlign = "left";
		}
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{

	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" && this.state.win_time < 0){

		}
	},

	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameJeroglyph );

