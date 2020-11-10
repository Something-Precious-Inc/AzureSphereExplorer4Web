function clearArea(){
	const area = document.getElementById("area");
	while(area.childElementCount>0){
		area.removeChild(area.firstElementChild);
	}
}

function createText(div, text){
	const textElem = document.createElement("div");
	const textNode = document.createTextNode(text);
	textElem.appendChild(textNode);
	div.appendChild(textElem);
}

function createTextwithID(div, id, text){
	const textElem = document.createElement("div");
	textElem.setAttribute("id",id);
	textElem.textContent = text;
	div.appendChild(textElem);
}

function createTextBox(div, id, text){
	const textBoxElem = document.createElement("input");
	textBoxElem.setAttribute("type","text"); 
	textBoxElem.setAttribute("value", text);
	textBoxElem.setAttribute("id", id);
	div.appendChild(textBoxElem);
}

function createRadioButton(div, name, id, text, checked){
	const radioButtonElem = document.createElement("input");
	var labelElem = document.createElement('label');
	radioButtonElem.setAttribute("type","radio"); 
	radioButtonElem.setAttribute("name", name);
	radioButtonElem.setAttribute("id", id);
	radioButtonElem.checked = checked;
 	labelElem.setAttribute("for", id);
    labelElem.innerHTML = text;
	div.appendChild(radioButtonElem);
	div.appendChild(labelElem);
}

function createLineBreak(div){
	const linebreak = document.createElement("br");
	div.appendChild(linebreak);
}

function createBotton(div, id, method, text){
	const buttonElem = document.createElement("button");
	buttonElem.setAttribute("class","btn btn-primary"); 
	buttonElem.setAttribute("id", id);
	buttonElem.addEventListener("click", {handleEvent:method});
	buttonElem.innerHTML = text;
	div.appendChild(buttonElem);
}

function createSelectBox(div, id, items){
	const selectBoxElem = document.createElement("select");
	selectBoxElem.setAttribute("id", id);
	
	items.forEach((value) => {
		const itemElem = document.createElement("option");
		itemElem.setAttribute("value", value);
		itemElem.innerHTML= value;
		selectBoxElem.appendChild(itemElem);
	});
	div.appendChild(selectBoxElem);
}

function createUploatFileForm(div, id){
	const formElem = document.createElement("form");
	const fileElem = document.createElement("input");
	fileElem.setAttribute("type","file");
	fileElem.setAttribute("accept",".imagepackage");
	fileElem.setAttribute("id", id);
	formElem.appendChild(fileElem);
	div.appendChild(formElem);
}