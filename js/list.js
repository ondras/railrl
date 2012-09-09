Game.List = function(cancelCallback) {
	this._cancelCallback = cancelCallback;
	this._items = [];
	this._node = document.createElement("div");
}

Game.List.prototype.addItem = function(label, callback, disabled) {
	this._items.push({
		label: label,
		callback: callback,
		disabled: disabled
	});
}

Game.List.prototype.show = function() {
	window.addEventListener("keydown", this);
	
	for (var i=0;i<this._items.length;i++) {
		var item = this._items[i];
		this._buildItem(item.label, i+1, item.disabled);
	}
	
	this._buildItem("Cancel", 0);
	
	
	document.body.appendChild(this._node);
}

Game.List.prototype.handleEvent = function(e) {
	var code = e.keyCode;
	var index = -2;
	if (code >= 48 && code <= 70) { index = code - 49; }
	if (code >= 96 && code <= 105) { index = code - 97; }
	
	if (index == -2 || index >= this._items.length) { return; } /* invalid key */
	if (index != -1 && this._items[index].disabled) { return; } /* disabled */
	
	window.removeEventListener("keydown", this);
	this._hide();

	if (index == -1) {
		this._cancelCallback();
	} else {
		this._items[index].callback();
	}
}

Game.List.prototype._buildItem = function(label, number, disabled) {
	var p = document.createElement("p");
	var str = number.toString(16) + ". " + label;
	if (disabled) { str += " ("+disabled+")"; }
	p.innerHTML = str;
	this._node.appendChild(p);
}

Game.List.prototype._hide = function() {
	this._node.parentNode.removeChild(this._node);
}
