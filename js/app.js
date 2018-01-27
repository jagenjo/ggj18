var APP = {

	canvas: null,
	time: 0,
	
	stages: {},
	current_stage: null,
	
	assets: {},

	init: function()
	{
		this.canvas = document.querySelector("canvas");
		this.canvas.addEventListener("mousedown", this.onMouse.bind(this) );
		this.canvas.addEventListener("mousemove", this.onMouse.bind(this) );
		this.canvas.addEventListener("mouseup", this.onMouse.bind(this) );
		
		for(var i in this.stages)
		{
			var stage = this.stages[i];
			if(stage.onInit)
				stage.onInit();
		}
		
		this.changeStage( LOADSTAGE );
		
		this.start();
	},
	
	start: function()
	{
		var that = this;
		var start_time = getTime();
		var prev = start_time;
		loop();
		
		function loop()
		{
			var now = getTime();
			that.time = now - start_time;
			var dt = now - prev;
			prev = now;
			requestAnimationFrame( loop );
			that.render();
			that.update( dt );
		}
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

