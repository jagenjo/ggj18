var APP = {

	canvas: null,
	time: 0,
	
	stages: {},
	current_stage: null,
	
	assets: {},

	init: function()
	{
		var main = this.main = document.querySelector("#main");
		var canvas = this.canvas = document.querySelector("canvas");
		
		onResize();
		
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
		
		this.changeStage( LOADSTAGE );
		
		this.loop.start();
		
		function onResize(e){
			var w = window.screen.width;
			var h = window.screen.height;
			w = document.body.offsetWidth;
			h = document.body.offsetHeight;
			main.style.left = (((w - canvas.width*2) / 2)|0) + "px";
			main.style.top = (((h - canvas.height*2) / 2)|0) + "px";
		}
		
		window.onresize = onResize;
	},
		
	render: function()
	{
		var canvas = this.canvas;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "red";
		ctx.fillRect(0,0, this.canvas.width, this.canvas.height );

		if( this.current_stage.onRender )
			this.current_stage.onRender(canvas);
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
			if(this.current_stage.onLeave)
				this.current_stage.onLeave();
		}		
		
		this.current_stage = stage;
		if(stage.onEnter)
			stage.onEnter();
	}
};

