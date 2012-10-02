Game.Window = function(content) {
	this._container = document.createElement("div");
	this._container.className = "window";
	this._container.appendChild(content);
	document.body.appendChild(this._container);
	
	window.addEventListener("resize", this);
	this._sync();
}

Game.Window.prototype.close = function() {
	this._container.parentNode.removeChild(this._container);
	window.removeEventListener("resize", this);
}

Game.Window.prototype.handleEvent = function(e) {
	this._sync();
}

Game.Window.prototype._sync = function() {
	this._container.style.width = "";
	
	var w = window.innerWidth;
	var h = window.innerHeight;
	w -= document.querySelector("#column").offsetWidth;
	
	var limit = w*0.8;
	if (this._container.offsetWidth > limit) {
		this._container.style.width = Math.round(limit) + "px";
	}
	
	var left = (w-this._container.offsetWidth)/2;
	var top = (h-this._container.offsetHeight)/2;
	
	this._container.style.left = Math.round(left) + "px";
	this._container.style.top = Math.round(top) + "px";
}
