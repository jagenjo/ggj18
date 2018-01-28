var APP = {

	canvas: null,
	time: 0,
	
	stages: {},
	current_stage: null,
	
	assets: {},

	init: function()
	{
		NETWORK.init();
	
		var main = this.main = document.querySelector("#main");
		var canvas = this.canvas = document.querySelector("canvas");
		onResize();
		canvas.width = (main.offsetWidth * 0.5)|0;
		canvas.height = (main.offsetHeight * 0.5)|0;
		
		this.loop = new GameLoop( this.canvas );
		this.loop.ondraw = this.render.bind(this);
		this.loop.onupdate = this.update.bind(this);
		this.loop.onmouse = this.onMouse.bind(this);
		this.loop.onkey = this.onKey.bind(this);
		
		for(var i in this.stages)
		{
			var stage = this.stages[i];
			if(stage.onInit)
				stage.onInit();
		}
		
		GAMES.init();
		
		this.changeStage( LOADSTAGE );
		
		this.loop.start();
		
		function onResize(e){
			var w = window.screen.width;
			var h = window.screen.height;
			w = document.body.offsetWidth;
			h = document.body.offsetHeight;
			main.style.left = (((w - main.offsetWidth)/2)|0) + "px";
			main.style.top = (((h - main.offsetHeight)/2)|0) + "px";
		}
		this.onResize = onResize;
		window.onresize = onResize;
		
		window.onbeforeunload = this.onBeforeUnload.bind(this);
	},
		
	render: function()
	{
		var canvas = this.canvas;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "black";
		ctx.fillRect(0,0, this.canvas.width, this.canvas.height );

		if( this.current_stage.onRender )
			this.current_stage.onRender(canvas,ctx);
	},
	
	update: function(dt)
	{
		if( this.current_stage.onUpdate )
			this.current_stage.onUpdate(dt);
	},
	
	onMouse: function(e)
	{
		
		//to local canvas coordinates
		if( this.current_stage.onMouse )
			this.current_stage.onMouse(e);
	},
	
	onKey: function(e)
	{
		if( this.current_stage.onKey )
			this.current_stage.onKey(e);
	},
	
	onBeforeUnload: function()
	{
		if( this.current_stage.onBeforeUnload )
			this.current_stage.onBeforeUnload();
	},
	
	registerStage: function( stage )
	{
		this.stages[ stage.name ] = stage;
	},
	
	changeStage: function( stage )
	{
		if(stage.constructor === String)
			stage = this.stages[ stage ];
			
		if(this.current_stage)
		{
			this.current_stage.active = false;
			if(this.current_stage.onLeave)
				this.current_stage.onLeave();
		}		
		
		this.current_stage = stage;
		this.current_stage.active = true;
		this.current_stage.start_time = getTime() * 0.001;
		if(stage.onEnter)
			stage.onEnter();
	},
	
	toggleSpectatorMode: function()
	{
		this.main.classList.toggle("spectator");
		this.spectator_mode = this.main.classList.contains("spectator");
		this.onResize();
		if( this.spectator_mode )
		{
			this.canvas.width = this.main.offsetWidth;
			this.canvas.height = this.main.offsetHeight;
			this.changeStage( TOWERSTAGE );
		}
		else
		{
			this.canvas.width = 320;
			this.canvas.height = 240;
			this.changeStage( MENUSTAGE );
		}
		//this.changeStage( TOWERSTAGE );
	}
};

