window.bold = function() {
	document.execCommand('bold', false, null);
}

window.erase = function() {
	document.execCommand('removeFormat', false, null);
}

window.italic = function() {
	document.execCommand('italic', false, null);
}

window.ul = function() {
	document.execCommand('insertUnorderedList', false, null);
}

window.ol = function() {
	document.execCommand('insertOrderedList', false, null);
}
window.insert = function(text) {
	range = window.getSelection().getRangeAt(0);
	range.insertNode(document.createTextNode(text));
}

window.wrap = function(elem) {
	var range = window.getSelection().getRangeAt(0);
	var wrapper = range.commonAncestorContainer.parentElement;
	/*if ($(wrapper).is(elem)) {
		$(wrapper).replaceWith(wrapper.textContent)
		return;
	}*/
	var wrap = document.createElement(elem);
	range.surroundContents(wrap);
	
	window.getSelection().removeAllRanges();
}

window.quotes = function() {
	range = window.getSelection().getRangeAt(0);
	selectedText = range.toString();
	range.deleteContents();
	range.insertNode(document.createTextNode('«' + selectedText + '»'));
}


//горячие клавиши
function hotkeys(e) {
	var d = false;
	if (!e)
		e = window.event;
	var k = e.keyCode;
	
		
	var keys = {
		key83: {function: 'insert', args: "\u00A0"},//S
		key78: {function: 'insert', args: "\u00A0\u2013"},//N
		key77: {function: 'insert', args: "\u00A0\u2014"},//M
		key82: {function: 'insert', args: '<br>'},//R
		key81: {function: 'quotes',	args: ''},//Q
		key80: {function: 'wrap',	args: 'p'},//P
		key49: {function: 'wrap',	args: 'h1'},//1
		key50: {function: 'wrap',	args: 'h2'},//2
		key51: {function: 'wrap',	args: 'h3'},//3
		key52: {function: 'wrap',	args: 'h4'},//4
		key66: {function: 'bold',	args: ''}, //B
		key69: {function: 'erase',	args: ''}, //E
		key73: {function: 'italic',	args: ''},//I
		key76: {function: 'ul',		args: ''},//L
		key79: {function: 'ol',		args: ''}//O
		};
	
	if (e.altKey) {
		if (k != 18) { //alt
			//console.log('key ' + k);
		}
		
		var key = 'key'+k;
		if (keys.hasOwnProperty(key)) {
			var input_area = document.activeElement.getAttribute('id');
			
			var functionName = keys[key].function;
			var functionArgs = keys[key].args;
			console.log(k, functionName + ' ' + functionArgs);
			window[functionName](functionArgs);

			return false;
		}
		
		//навигация
		if (k == 37) { d = document.getElementById('prev'); } // Left
		if (k == 39) { d = document.getElementById('next'); } // Right
		if (k == 38) { d = document.getElementById('newest'); } // Up
		if (k == 40) { d = document.getElementById('oldest'); } // Down
		
	}		
	if (d)
		location.href = d.href;
}

	

function ready() {
	//если есть поля для удобного редактирования
	if (document.querySelectorAll('.cool_edit').length > 0) {
		document.addEventListener('keydown', hotkeys);
	}
}

document.addEventListener("DOMContentLoaded", ready);
