var fps = 60, last = Date.now();

function workerLoop() {
	var now = Date.now();
    postMessage((now - last) / 1000);

    last = now;
    setTimeout(workerLoop, 1000 / fps);
}

self.onmessage = function(event){
   if(event.data.event == "start"){
   		fps = event.data.framespersecond;
   		workerLoop();
   }
};