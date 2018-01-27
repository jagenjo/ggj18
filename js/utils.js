if(typeof(performance) != "undefined")
  window.getTime = performance.now.bind(performance);
else
  window.getTime = Date.now.bind( Date );
