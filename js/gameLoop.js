
var getTime = performance.now.bind( performance );
var LEFT_MOUSE_BUTTON = 1;
var MIDDLE_MOUSE_BUTTON = 2;
var RIGHT_MOUSE_BUTTON = 3;

var global = this;

function GameLoop( canvas, options )
{
	options = options || {};
	
	var that = this;
	this.canvas = canvas;
	
	var capture_wheel = true;
	var only_keys_in_canvas = true;
	var prevent_default_keys = true;

	this.ondraw = null;	
	this.onupdate = null;
	this.onmouse = null;
	this.onkey = null;
	
	this.dragging = false;
	this.last_pos = [0,0];
	
	//mouse
	var mouse = this.mouse = {
		buttons: 0, //this should always be up-to-date with mouse state
		left_button: false,
		middle_button: false,
		right_button: false,
		position: new Float32Array(2),
		x:0, //in canvas coordinates
		y:0,
		deltax: 0,
		deltay: 0,
		clientx:0, //in client coordinates
		clienty:0,
		isInsideRect: function(x,y,w,h, flip_y )
		{
			var mouse_y = this.y;
			if(flip_y)
				mouse_y = that.canvas.height - mouse_y;
			if( this.x > x && this.x < x + w &&
				mouse_y > y && mouse_y < y + h)
				return true;
			return false;
		},
		isButtonPressed: function(num)
		{
			return this.buttons & (1<<RIGHT_MOUSE_BUTTON);
		}
	};
	
	//events
	canvas.addEventListener("mousedown", onmouse);
	canvas.addEventListener("mousemove", onmouse);
	if(capture_wheel)
	{
		canvas.addEventListener("mousewheel", onmouse, false);
		canvas.addEventListener("wheel", onmouse, false);
		//canvas.addEventListener("DOMMouseScroll", onmouse, false); //deprecated or non-standard
	}
	//prevent right click context menu
	canvas.addEventListener("contextmenu", function(e) { e.preventDefault(); return false; });

	canvas.addEventListener("touchstart", ontouch, true);
	canvas.addEventListener("touchmove", ontouch, true);
	canvas.addEventListener("touchend", ontouch, true);
	canvas.addEventListener("touchcancel", ontouch, true);   

	canvas.addEventListener('gesturestart', ongesture );
	canvas.addEventListener('gesturechange', ongesture );
	canvas.addEventListener('gestureend', ongesture );	
	
	function onmouse(e) {
	
		var old_mouse_mask = that.mouse.buttons;
		that.augmentEvent(e, canvas);
		e.eventType = e.eventType || e.type; //type cannot be overwritten, so I make a clone to allow me to overwrite
		var now = getTime();

		//mouse info
		mouse.dragging = e.dragging;
		mouse.position[0] = e.canvasx;
		mouse.position[1] = e.canvasy;
		mouse.x = e.canvasx;
		mouse.y = e.canvasy;
		mouse.clientx = e.mousex;
		mouse.clienty = e.mousey;
		mouse.left_button = mouse.buttons & (1<<LEFT_MOUSE_BUTTON);
		mouse.middle_button = mouse.buttons & (1<<MIDDLE_MOUSE_BUTTON);
		mouse.right_button = mouse.buttons & (1<<RIGHT_MOUSE_BUTTON);

		if(e.eventType == "mousedown")
		{
			if(old_mouse_mask == 0) //no mouse button was pressed till now
			{
				canvas.removeEventListener("mousemove", onmouse);
				var doc = canvas.ownerDocument;
				doc.addEventListener("mousemove", onmouse);
				doc.addEventListener("mouseup", onmouse);
			}
			last_click_time = now;

			if(that.onmousedown)
				that.onmousedown(e);
			if(window.LEvent)
				LEvent.trigger(that,"mousedown");
		}
		else if(e.eventType == "mousemove")
		{ 
			if(that.onmousemove)
				that.onmousemove(e); 
			if(window.LEvent)
				LEvent.trigger(that,"mousemove",e);
		} 
		else if(e.eventType == "mouseup")
		{
			if(that.mouse.buttons == 0) //no more buttons pressed
			{
				canvas.addEventListener("mousemove", onmouse);
				var doc = canvas.ownerDocument;
				doc.removeEventListener("mousemove", onmouse);
				doc.removeEventListener("mouseup", onmouse);
			}
			e.click_time = now - last_click_time;
			//last_click_time = now; //commented to avoid reseting click time when unclicking two mouse buttons

			if(that.onmouseup)
				that.onmouseup(e);
			if(window.LEvent)
				LEvent.trigger(that,"mouseup",e);
		}
		else if((e.eventType == "mousewheel" || e.eventType == "wheel" || e.eventType == "DOMMouseScroll"))
		{ 
			e.eventType = "mousewheel";
			if(e.type == "wheel")
				e.wheel = -e.deltaY; //in firefox deltaY is 1 while in Chrome is 120
			else
				e.wheel = (e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60);

			//from stack overflow
			//firefox doesnt have wheelDelta
			e.delta = e.wheelDelta !== undefined ? (e.wheelDelta/40) : (e.deltaY ? -e.deltaY/3 : 0);
			//console.log(e.delta);
			if(that.onmousewheel)
				that.onmousewheel(e);

			if(window.LEvent)
				LEvent.trigger(that, "mousewheel", e);
		}

		if(that.onmouse)
			that.onmouse(e);

		if(e.eventType != "mousemove")
			e.stopPropagation();
		e.preventDefault();
		return false;
	}//onmouse

	//translates touch events in mouseevents
	function ontouch(e)
	{
		var touches = e.changedTouches,
			first = touches[0],
			type = "";

		//ignore secondary touches
        if(e.touches.length && e.changedTouches[0].identifier !== e.touches[0].identifier)
        	return;
        	
		if(touches > 1)
			return;

		 switch(e.type)
		{
			case "touchstart": type = "mousedown"; break;
			case "touchmove":  type = "mousemove"; break;        
			case "touchend":   type = "mouseup"; break;
			default: return;
		}

		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(type, true, true, window, 1,
								  first.screenX, first.screenY,
								  first.clientX, first.clientY, false,
								  false, false, false, 0/*left*/, null);
		simulatedEvent.originalEvent = simulatedEvent;
		simulatedEvent.is_touch = true;
		first.target.dispatchEvent(simulatedEvent);		
		e.preventDefault();
	}

	function ongesture(e)
	{
		if(that.ongesture)
		{ 
			e.eventType = e.type;
			that.ongesture(e);
		}
		event.preventDefault();
	}

	var keys = this.keys = {};


	var onkey_handler = null;
	
	var target = only_keys_in_canvas ? this.canvas : document;

	document.addEventListener("keydown", inner_keys );
	document.addEventListener("keyup", inner_keys );
	function inner_keys(e) { onkey(e, prevent_default_keys); }
	onkey_handler = inner_keys;


	function onkey(e, prevent_default)
	{
		//trace(e);
		e.eventType = e.type; //type cannot be overwritten, so I make a clone to allow me to overwrite

		var target_element = e.target.nodeName.toLowerCase();
		if(target_element === "input" || target_element === "textarea" || target_element === "select")
			return;

		e.character = String.fromCharCode(e.keyCode).toLowerCase();
		var prev_state = false;
		var key = GameLoop.mapKeyCode(e.keyCode);
		if(!key) //this key doesnt look like an special key
			key = e.character;

		//regular key
		if (!e.altKey && !e.ctrlKey && !e.metaKey) {
			if (key) 
				that.keys[key] = e.type == "keydown";
			prev_state = that.keys[e.keyCode];
			that.keys[e.keyCode] = e.type == "keydown";
		}

		//avoid repetition if key stays pressed
		if(prev_state != that.keys[e.keyCode])
		{
			if(e.type == "keydown" && that.onkeydown) 
				that.onkeydown(e);
			else if(e.type == "keyup" && that.onkeyup) 
				that.onkeyup(e);
			if(window.LEvent)
				LEvent.trigger(gl, e.type, e);
		}

		if(that.onkey)
			that.onkey(e);

		if(prevent_default && (e.isChar || GameLoop.blockable_keys[e.keyIdentifier || e.key ]) )
			e.preventDefault();
	}

	//gamepads
	this.gamepads = null;

	/**
	* Tells the system to capture gamepad events on the canvas. 
	* @method captureGamepads
	*/
	var getGamepads = navigator.getGamepads || navigator.webkitGetGamepads || navigator.mozGetGamepads; 
	if(getGamepads)
		this.gamepads = getGamepads.call(navigator);
}//end ctor

/**
* returns the detected gamepads on the system
* @method getGamepads
* @param {bool} skip_mapping if set to true it returns the basic gamepad, otherwise it returns a class with mapping info to XBOX controller
*/
GameLoop.prototype.getGamepads = function(skip_mapping)
{
	//gamepads
	var getGamepads = navigator.getGamepads || navigator.webkitGetGamepads || navigator.mozGetGamepads; 
	if(!getGamepads)
		return;
	var gamepads = getGamepads.call(navigator);
	if(!this.gamepads)
		this.gamepads = [];
	for(var i = 0; i < 4; i++)
	{
		var gamepad = gamepads[i]; //current state

		if(gamepad && !skip_mapping)
			GameLoop.addGamepadXBOXmapping(gamepad);

		var old_gamepad = this.gamepads[i]; //old state

		//launch connected gamepads events
		if(!old_gamepad && gamepad)
		{
			var event = new CustomEvent("gamepadconnected");
			event.eventType = event.type;
			event.gamepad = gamepad;;
			if(this.ongamepadconnected)
				this.ongamepadconnected(event);
			if(window.LEvent)
				LEvent.trigger(this,"gamepadconnected",event);
		}
		else if(old_gamepad && !gamepad)
		{
			var event = new CustomEvent("gamepaddisconnected");
			event.eventType = event.type;
			event.gamepad = old_gamepad;
			if(this.ongamepaddisconnected)
				this.ongamepaddisconnected(event);
			if(window.LEvent)
				LEvent.trigger(this,"gamepaddisconnected",event);
		}

		//seek buttons changes to trigger events
		if(gamepad)
		{
			for(var j = 0; j < gamepad.buttons.length; ++j)
			{
				var button = gamepad.buttons[j];
				if( button.pressed && (!old_gamepad || !old_gamepad.buttons[j].pressed))
				{
					var event = new CustomEvent("gamepadButtonDown");
					event.eventType = event.type;
					event.button = button;
					event.which = j;
					event.gamepad = gamepad;
					if(this.onbuttondown)
						this.onbuttondown(event);
					if(window.LEvent)
						LEvent.trigger(this,"buttondown",event);
				}
				else if( !button.pressed && (old_gamepad && old_gamepad.buttons[j].pressed))
				{
					var event = new CustomEvent("gamepadButtonUp");
					event.eventType = event.type;
					event.button = button;
					event.which = j;
					event.gamepad = gamepad;
					if(this.onbuttondown)
						this.onbuttondown(event);
					if(window.LEvent)
						LEvent.trigger(this,"buttonup",event);
				}
			}
		}
	}
	this.gamepads = gamepads;
	return gamepads;
}

GameLoop.prototype.addGamepadXBOXmapping = function( gamepad )
{
	//xbox controller mapping
	var xbox = { axes:[], buttons:{}, hat: ""};
	xbox.axes["lx"] = gamepad.axes[0];
	xbox.axes["ly"] = gamepad.axes[1];
	xbox.axes["rx"] = gamepad.axes[2];
	xbox.axes["ry"] = gamepad.axes[3];
	xbox.axes["triggers"] = gamepad.axes[4];

	for(var i = 0; i < gamepad.buttons.length; i++)
	{
		switch(i) //I use a switch to ensure that a player with another gamepad could play
		{
			case 0: xbox.buttons["a"] = gamepad.buttons[i].pressed; break;
			case 1: xbox.buttons["b"] = gamepad.buttons[i].pressed; break;
			case 2: xbox.buttons["x"] = gamepad.buttons[i].pressed; break;
			case 3: xbox.buttons["y"] = gamepad.buttons[i].pressed; break;
			case 4: xbox.buttons["lb"] = gamepad.buttons[i].pressed; break;
			case 5: xbox.buttons["rb"] = gamepad.buttons[i].pressed; break;
			case 6: xbox.buttons["lt"] = gamepad.buttons[i].pressed; break;
			case 7: xbox.buttons["rt"] = gamepad.buttons[i].pressed; break;
			case 8: xbox.buttons["back"] = gamepad.buttons[i].pressed; break;
			case 9: xbox.buttons["start"] = gamepad.buttons[i].pressed; break;
			case 10: xbox.buttons["ls"] = gamepad.buttons[i].pressed; break;
			case 11: xbox.buttons["rs"] = gamepad.buttons[i].pressed; break;
			case 12: if( gamepad.buttons[i].pressed) xbox.hat += "up"; break;
			case 13: if( gamepad.buttons[i].pressed) xbox.hat += "down"; break;
			case 14: if( gamepad.buttons[i].pressed) xbox.hat += "left"; break;
			case 15: if( gamepad.buttons[i].pressed) xbox.hat += "right"; break;
			case 16: xbox.buttons["home"] = gamepad.buttons[i].pressed; break;
			default:
		}
	}
	gamepad.xbox = xbox;
}	

GameLoop.blockable_keys = {"Up":true,"Down":true,"Left":true,"Right":true};
GameLoop.mapKeyCode = function(code)
{
	var named = {
		8: 'BACKSPACE',
		9: 'TAB',
		13: 'ENTER',
		16: 'SHIFT',
		17: 'CTRL',
		27: 'ESCAPE',
		32: 'SPACE',
		37: 'LEFT',
		38: 'UP',
		39: 'RIGHT',
		40: 'DOWN'
	};
	return named[code] || (code >= 65 && code <= 90 ? String.fromCharCode(code) : null);
}

GameLoop.prototype.start = function()
{
	var post = global.requestAnimationFrame;
	var time = getTime();
	var that = this;

	//loop only if browser tab visible
	function loop() {

		that._requestFrame_id = post(loop); //do it first, in case it crashes

		var now = getTime();
		var dt = (now - time) * 0.001;

		if (that.onupdate) 
			that.onupdate(dt);
			
		if (that.ondraw)
			that.ondraw();
		time = now;
	}
	this._requestFrame_id = post(loop); //launch main loop
}	

//add useful info to the event

//adds extra info to the MouseEvent (coordinates in canvas axis, deltas and button state)
GameLoop.prototype.augmentEvent = function(e, root_element)
{
	var offset_left = 0;
	var offset_top = 0;
	var b = null;

	root_element = root_element || e.target || this.canvas;
	b = root_element.getBoundingClientRect();
		
	e.mousex = e.clientX - b.left;
	e.mousey = e.clientY - b.top;
	e.canvasx = e.mousex;
	e.canvasy = b.height - e.mousey;
	e.deltax = 0;
	e.deltay = 0;
	
	if(e.type == "mousedown")
	{
		this.dragging = true;
		this.mouse.buttons |= (1 << e.which); //enable
	}
	else if (e.type == "mousemove")
	{
	}
	else if (e.type == "mouseup")
	{
		this.mouse.buttons = this.mouse.buttons & ~(1 << e.which);
		if(this.mouse.buttons == 0)
			this.dragging = false;
	}

	if(e.movementX !== undefined) //pointer lock
	{
		e.deltax = e.movementX;
		e.deltay = e.movementY;
	}
	else
	{
		e.deltax = e.mousex - this.last_pos[0];
		e.deltay = e.mousey - this.last_pos[1];
	}
	this.last_pos[0] = e.mousex;
	this.last_pos[1] = e.mousey;

	//insert info in event
	e.dragging = this.dragging;
	e.buttons_mask = this.mouse.buttons;
	e.leftButton = this.mouse.buttons & (1<<LEFT_MOUSE_BUTTON);
	e.middleButton = this.mouse.buttons & (1<<MIDDLE_MOUSE_BUTTON);
	e.rightButton = this.mouse.buttons & (1<<RIGHT_MOUSE_BUTTON);
	e.isButtonPressed = function(num) { return this.buttons_mask & (1<<num); }
}
