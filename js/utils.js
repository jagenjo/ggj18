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

CanvasRenderingContext2D.prototype.drawSprite = function( img, x,y, num, size )
{
	num = Math.floor(num);
	var frames = img.width / size;
	var ix = num % frames;
	var iy = Math.floor( num / frames );
	this.drawImage( img, ix * size, iy * size, size, size, x,y, size, size ); 
}

Object.defineProperty( Array.prototype, "random", {
	value: function(){
		return this[ (Math.random() * this.length)|0 ];
	},
	enumerable: false
});


var DEG2RAD = 0.0174533;
