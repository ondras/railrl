Game.List = function(label, cancelCallback) {
	this._cancelCallback = cancelCallback;
	this._items = [];
	this._node = document.createElement("div");
	this._node.innerHTML = "<p>" + label + "</p>";
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
	
	document.querySelector("#log").appendChild(this._node);
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
	var str = "";
	if (number == 0) {
		str += "<em class='cancel'>"; 
	} else if (!disabled) { 
		str += "<em>"; 
	}
	str += number.toString(16);
	if (!disabled) { str += "</em>"; }
	str += ". " + label;
	p.innerHTML = str;

	if (disabled) {
		if (typeof(disabled) == "string") {
			var text = document.createTextNode(" - " + disabled);
			p.appendChild(text);
		} else {
			var text = document.createTextNode(" - requires ");
			p.appendChild(text);
			Game.logItems(disabled, p);
		}
	}

	this._node.appendChild(p);
}

Game.List.prototype._hide = function() {
	this._node.parentNode.removeChild(this._node);
}
