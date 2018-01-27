//API CALLS
//GAME.finish(score) //to finish

var GameTelegraph = {
	name: "telegraph",
	scale: 1, 
	to_load: [], //urls of images and sounds to load
	
	//ALL GAME STATE SHOULD BE HERE, DO NOT STORE WEIRD STUFF LIKE IMAGES, DOM, ETC
	//GAME STATE IS SENT TO SERVER EVERY FRAME so keep it light
	state: {
		time: 0
	},

	//called after loading all games, init stuff here
	onInit: function()
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
	
	//render one frame, DO NOT MODIFY STATE
	onRender: function( canvas )
	{
	},

	//update game state	
	//ONLY USE INPUT_STATE TO COMPUTE NEW GAME_STATE
	onUpdate: function( input_state )
	{
	},
	
	onClick: function( e )
	{
	},
	
	//called when moving to other game
	//use to stop sounds or timers
	onFinish: function()
	{
	}
};

//register in DB
GAMES.registerGame( GameTelegraph );

