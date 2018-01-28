//API CALLS
//GAME.finish(score) //to finish

var GameSMS = {
	version: 0.1,
	name: "sms",
	scale: 1,
	to_load: ["data/sms/nokia2.png"], //urls of images and sounds to load

	sms: [
		"tqm",
		"ggj",
		"holi",
		"wtf",
		"lol",
		"hoyga",
		"omg",
		"wapi",
	],

	keys: [
		["a", "b", "c"],
		["d", "e", "f"],
		["g", "h", "i"],
		["j", "k", "l"],
		["m", "n", "o"],
		["p", "q", "r", "s"],
		["t", "u", "v"],
		["w", "x", "y", "z"],
	],

	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_when: 0,
		mouseup_when: 0,
		win_time: -1,
		sms: "",
		res: "",
		respos: 0,
		numpress: 0,
		lastkey: -1,
		lastpress: -1,
		fail: -1,
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
	
	restart: function(){
		this.state.win_time = -1;
		this.state.sms = this.sms[Math.floor(Math.random()*this.sms.length)];
		this.state.res = "";
		this.state.resl = "";
		this.state.respos = 0;
		this.state.lastkey = -1;
		this.state.lastpress = -1;
		this.state.numpress = 0;
		this.state.fail = -1;
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

		ctx.fillStyle = this.state.fail > 0 ? "red" : "#676767";
		ctx.fillRect(0,0,w,h);

		

		ctx.fillStyle = "#505945";
		ctx.fillRect(70,0,110,70);
		ctx.fillStyle = "#2b240f";
		ctx.font = "8px pixel";
		ctx.fillText((this.state.res + this.state.resl).toUpperCase(), 90,30);

		ctx.fillStyle = "white";
		ctx.drawImage(APP.assets["data/sms/nokia2.png"],0,0);
		ctx.fillText("Send!:", 10, 20);
		ctx.fillText("\"" + this.state.sms.toUpperCase() + "\"", 10, 40);



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
		if(this.state.win_time >= 0 && this.state.win_time + 2 < this.state.time){
			GAMES.playerWin();
			return;
		}else if(this.state.fail >= 0 && this.state.fail + 1 < this.state.time){
			this.restart();
		}else if(this.state.win_time < 0 && this.state.fail < 0 && this.state.lastpress + 0.5 < this.state.time){
			var r = this.state.res + this.state.resl;
			if(r.length >= this.state.sms.length){
				if(r == this.state.sms){
					this.state.win_time = this.state.time;
					GAMES.playSound("data/win1.wav", 0.5);
				}else{
					this.state.fail = this.state.time;
				}
			}
		}
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" && this.state.win_time < 0){
			var k = -1;
			if(e.posx > 80 && e.posx < 108){
				if(e.posy > 112 && e.posy < 132){

				}else if(e.posy > 133 && e.posy < 154){
					k = 2;
				}else if(e.posy > 155 && e.posy < 175){
					k = 5;
				}

			}else if(e.posx > 114 && e.posx < 143){
				if(e.posy > 112 && e.posy < 132){
					k = 0;
				}else if(e.posy > 133 && e.posy < 154){
					k = 3;
				}else if(e.posy > 155 && e.posy < 175){
					k = 6;
				}
			}else if(e.posx > 151 && e.posx < 176){
				if(e.posy > 112 && e.posy < 132){
					k = 1;
				}else if(e.posy > 133 && e.posy < 154){
					k = 4;
				}else if(e.posy > 155 && e.posy < 175){
					k = 7;
				}
			}

			if(k >= 0){
				if(this.state.lastkey != k || this.state.lastpress + 0.5 < this.state.time){
					this.state.respos += 1;
					this.state.res += this.state.resl;
					this.state.resl = this.keys[k][0];
					this.state.numpress = 1;
				}else{

					this.state.resl = this.keys[k][this.state.numpress % this.keys[k].length];
					this.state.numpress += 1;
				}
				this.state.lastkey = k;
				this.state.lastpress = this.state.time;
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
GAMES.registerGame( GameSMS );

