
var GameOutrun = {
	name: "outrun",
	version: 1,
	scale: 1,
	to_load: ["data/outrun/ball8.png", "data/outrun/boxgear.png", "data/outrun/car.png", "data/outrun/carfuck.png", "data/outrun/fondo.png", "data/outrun/police.png", "data/outrun/explossion.png"], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0, //time since game started
		mousedown: false,
		mousedown_was_pressed: false,
		state: 0,
		transmission_time: 0,
		boom_time: -1,
		win_time: -1,
		car: 0,
		car_vel: 10,
		car_accelerate: false,
		police: 30,
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
		this.state.state = 0;
		this.state.transmission_time = 0;
		this.state.boom_time = -1;
		this.state.win_time = -1;
		this.state.car = 0;
		this.state.car_vel = 10;
		this.state.car_accelerate = false;
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
		ctx.rect(4, 40, 246, 141);
		ctx.clip();
		this.drawRoad(ctx, 100, 224);
		ctx.drawImage( APP.assets["data/outrun/police.png"], this.state.police + 80, 100 );
		ctx.drawImageCentered( APP.assets[this.state.car < 50 ? "data/outrun/car.png" : "data/outrun/carfuck.png"], 125, 180 - this.state.car, 1 - this.state.car/200);
		if(this.state.boom_time > 0){
			ctx.drawImageCentered( APP.assets["data/outrun/explossion.png"], this.state.police + 110, 180 - this.state.car, 1 + 2*Math.random(), Math.floor(4*Math.random()) * 90);
		}else if(this.state.state == 1){
			var w = ctx.canvas.width / 2;
			var h = ctx.canvas.height / 2;
			ctx.drawImageCentered( APP.assets["data/outrun/boxgear.png"], w, h);
			var t = 2*(this.state.time - this.state.transmission_time);
			if(t < 0.25){
				ctx.drawImageCentered( APP.assets["data/outrun/ball8.png"], w-10 + 40*t, h-25);
			}else if(t < 0.75){
				ctx.drawImageCentered( APP.assets["data/outrun/ball8.png"], w, h-25 + 100*(t-0.25));
			}else{
				ctx.drawImageCentered( APP.assets["data/outrun/ball8.png"], w - 40*(t-0.75), h+25);
			}
		}else if(this.state.state == 2){
			ctx.textAlign = "center";
			ctx.font = "16px pixel";
			ctx.fillStyle = "black";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.3 + Math.random()*2-1 );
			ctx.fillStyle = "white";
			ctx.fillText( "WINNER!!", canvas.width * 0.5 + Math.random()*2-1, canvas.height * 0.3 + Math.random()*2-1 );
			ctx.textAlign = "left";
		}
		
		ctx.restore();
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( dt )
	{
		if(this.state.state == 0){
			if(this.state.boom_time < 0){
				//Normal state
				this.state.police = 30 + 30*Math.sin(0.6*(this.state.time-this.state.transmission_time) + Math.PI);
				if(this.state.car_accelerate){
					//Acceleration
					this.state.car_vel += 10*dt;
					this.state.car += dt * this.state.car_vel;

					if(this.state.car > 20 && this.state.car < 70 && this.state.police < 40){
						//Collision
						this.state.boom_time = this.state.time;
					}
				}

				if(this.state.car > 70){
					//Win condition
					this.state.car_accelerate = false;
					this.state.win_time = this.state.time;
					this.state.state = 2;
					GAMES.playSound("data/win1.wav", 0.5);
				}
			}else if(this.state.boom_time > 0 && this.state.boom_time + 2 < this.state.time){
				//Reset
				this.state.transmission_time = 0;
				this.state.boom_time = -1;
				this.state.car = 0;
				this.state.car_accelerate = false;
				this.state.car_vel = 10;
			}
		}else if(this.state.state == 1){
			//Transmission box
			if(this.state.transmission_time + 0.5 < this.state.time){
				this.state.state = 0;
				this.state.car_accelerate = true;
				this.state.transmission_time = this.state.time - this.state.transmission_time;
			}
		}else if(this.state.state == 2){
			//Win state
			if(this.state.win_time + 2 < this.state.time){
				GAMES.playerWin();
				return;
			}
		}		
	},
	
	onMouse: function( e )
	{
		if(e.type == "mousedown" && this.state.transmission_time == 0){
			this.state.state = 1;
			this.state.transmission_time = this.state.time;
		}
	},
	
	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameOutrun );

