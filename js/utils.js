if(typeof(performance) != "undefined")
  window.getTime = performance.now.bind(performance);
else
  window.getTime = Date.now.bind( Date );
Math.clamp = function(a,min,max) { return (a>max? max : (a<min?min:a)) };

CanvasRenderingContext2D.prototype.circle = function( x,y,r )
{
	this.beginPath();
	r=Math.abs(r);
	this.arc( x,y, r, 0, 2*Math.PI, false);
}

HTMLAudioElement.prototype.superloop = function( time )
{
	if(this._superlooped )
		return;

	time = time || 0.44;
	
	this.addEventListener('timeupdate', function(){
		if(this.currentTime > this.duration - time){
			this.currentTime = time;
			this.play();
			console.log("back");
		}	
	}, false);
	
	this._superlooped = true;
}