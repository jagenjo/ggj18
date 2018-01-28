//API CALLS
//GAME.finish(score) //to finish

var GameJeroglyph = {
	version: 0.2,
	name: "teacher",
	scale: 2,
	to_load: ["data/jeroglyph/blackboard.png", "data/jeroglyph/buttons.png", "data/jeroglyph/teacher_1.png", "data/jeroglyph/teacher_2.png", "data/jeroglyph/teacher_3.png", "data/jeroglyph/teacher_4.png", "data/jeroglyph/circle.png", "data/jeroglyph/rombo.png", "data/jeroglyph/square.png", "data/jeroglyph/triangle.png"], //urls of images and sounds to load
	teacher: ["data/jeroglyph/teacher_1.png", "data/jeroglyph/teacher_2.png", "data/jeroglyph/teacher_3.png", "data/jeroglyph/teacher_4.png"],
	glyphs: ["data/jeroglyph/circle.png", "data/jeroglyph/rombo.png", "data/jeroglyph/square.png", "data/jeroglyph/triangle.png"],

	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		win_time: -1,
		show_teaching: 0,
		sequence: "",
		sequenceProgress: 0,
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
		for(var i=0; i<5; i++){
			var r = Math.floor(Math.random()*4);
			s += (r == 0 ? "c" : r == 1 ? "r" : r == 2 ? "s" : "t");
		}
		this.state.sequence = s;
		this.state.sequenceProgress = 0;
	},
	
	restart: function(){
		this.state.win_time = -1;
		this.sequence();
		this.state.show_teaching = 0;

	},

	//called when the game starts
	//game_info contains difficulty_level:[0 easy, 5 hard]
	//use this to reset all the game state
	onStart: function( game_info )
	{
		//reset game state
		this.state.time = 0;
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

		if(this.state.show_teaching >= 0){
			ctx.drawImage(APP.assets["data/jeroglyph/blackboard.png"],0,0);
			ctx.fillText("Learn!:", 10, 20);
			var t = Math.floor((2+this.state.sequence.length) * this.state.show_teaching);
			var d = ((2+this.state.sequence.length) * this.state.show_teaching) % 1;

			ctx.drawImage(APP.assets[this.teacher[t < 2 ? t : t % 2 + 2]],0,0);
			if(t > 1 && d > 0.2)
				ctx.drawImage(APP.assets[this.glyphs[this.state.sequence[t-2] == "c" ? 0 : this.state.sequence[t-2] == "r" ? 1 : this.state.sequence[t-2] == "s" ? 2 : 3]],0,10);
		}else{
			ctx.drawImage(APP.assets["data/jeroglyph/buttons.png"],0,0);
			ctx.fillText("Remember!:", 10, 20);
		}

		if(this.state.win_time > 0){
			ctx.textAlign = "center";
			ctx.font = "16px pixel";
			ctx.fillStyle = "black";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.5 + Math.random()*2-1 );
			ctx.textAlign = "left";
		}
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if(this.state.show_teaching >= 0){
			this.state.show_teaching += 0.2*dt;
			if(this.state.show_teaching > 1) this.state.show_teaching = -1;
		}

		if(this.state.win_time > 0 && this.state.win_time + 2 < this.state.time){
			GAMES.playerWin();
			return;
		}
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" && this.state.win_time < 0 && this.state.show_teaching < 0){
			var g;
			if(e.posx > 12 && e.posx < 56 && e.posy > 32 && e.posy < 68){
				g = "c";
			}else if(e.posx > 72 && e.posx < 116 && e.posy > 32 && e.posy < 68){
				g = "r";
			}else if(e.posx > 12 && e.posx < 56 && e.posy > 72 && e.posy < 108){
				g = "s";
			}else if(e.posx > 72 && e.posx < 116 && e.posy > 72 && e.posy < 108){
				g = "t";
			}

			if(g){
				if(this.state.sequence[this.state.sequenceProgress] == g){
					this.state.sequenceProgress += 1;
					if(this.state.sequenceProgress == this.state.sequence.length){
						//WIN!
						this.state.win_time = this.state.time;
						GAMES.playSound("data/win1.wav", 0.5);
					}
				}else{
					this.restart();
				}
			}
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

