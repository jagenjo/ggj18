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

CanvasRenderingContext2D.prototype.drawImageCentered = function( img, x,y,s,r )
{
	s = s || 1;
	r = r || 0;
	
	this.save();
	this.translate(x,y);
	if(s != 1)
		this.scale(s,s);
	if(r != 0 )
		this.rotate(r);
	this.drawImage( img, img.width * -0.5, img.height * -0.5 ); 
	this.restore();
}

var DEG2RAD = 0.0174533;
