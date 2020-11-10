async function createGroup(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/devicegroups";
	var content = {};
	content["Description"]=document.getElementById("descTextBox").value;
	content["Name"]=document.getElementById("nameTextBox").value;
	content["ProductId"]=gCurrProduct.id;
	content["OsFeedType"]=document.getElementById("OsFeedTypeBox").selectedIndex;
	content["UpdatePolicy"]=document.getElementById("UpdatePolicyBox").selectedIndex;

	document.getElementById("createGroupButton").disabled = true;
    await asyncPublicAPI("POST", gToken.accessToken, endpoint, JSON.stringify(content), createGroupResult);
}

function createGroupArea(){
	clearArea();
	const area = document.getElementById("area");

	if(!gCurrProduct){
		createText(area, " Product is not selected!");
		return;
	}

	createText(area, "Name:");
	createTextBox(area, "nameTextBox", "testGroup");
	createLineBreak(area);
	createText(area, "Description:");
	createTextBox(area, "descTextBox", "");
	createLineBreak(area);
	createText(area, "Product: ");
	createTextwithID(area, "productName", gCurrProduct.textContent);
	var items = ["UpdateAll", "No3rdPartyAppUpdates"/*, "NoUpdates"*/];
	createText(area, "OsFeedType:");
	createSelectBox(area, "OsFeedTypeBox", items);
	createLineBreak(area);
	var items = ["Retail", "RetailEval"];
	createText(area, "UpdatePolicy:");
	createSelectBox(area, "UpdatePolicyBox", items);
	createLineBreak(area);
	createBotton(area, "createGroupButton", createGroup, "CREATE");
}

async function createGroupResult(res){
	console.log("createGroupResult is " + res);
	var div = document.getElementById("result");
	if(div){
		if(res){
			div.textContent = "Group create is success.";
		} else {
			div.textContent = "Group create is failure!";
		}
	}else{
		if(res){
			createTextwithID(area, "result", "Group create is success.");
		} else {
			createTextwithID(area, "result", "Group create is failure!");
		}
	}

	if(res){
		await updateGroups();
		SelectExtractProduct(gCurrProduct);
	}
	document.getElementById("createGroupButton").disabled = false;
}

async function deleteGroup(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/devicegroups/" + gCurrGroup.id;
	
	document.getElementById("deleteGroupButton").disabled = true;
	await asyncOperation("DELETE", gToken.accessToken, endpoint, "", deleteGroupResult);
}

async function deleteGroupResult(res){
	console.log("deleteGroupResult is " + res);
	var div = document.getElementById("result");
	if(div){
		if(res){
			div.textContent = "Group delete is success.";
		} else {
			div.textContent = "Group delete is failure!";
		}
	}else{
		if(res){
			createTextwithID(area, "result", "Group delete is success.");
		} else {
			createTextwithID(area, "result", "Group delete is failure!");
		}
	}

	if(res){
		await updateGroups();
		SelectExtractProduct(gCurrProduct);
	}
	document.getElementById("deleteGroupButton").disabled = false;
}

function deleteGroupArea(){
	clearArea();
	const area = document.getElementById("area");

	if(!gCurrGroup){
		createText(area, "Delete group is not selected!");
		return;
	}

	createText(area, "Delete group is ");
	createTextwithID(area, "groupName", gCurrGroup.textContent);
	createLineBreak(area);
	createBotton(area, "deleteGroupButton", deleteGroup, "DELETE");
}

function uploadImage(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/images";
	const fileElem = document.getElementById("imagepackagePath");
	if (fileElem.files.length <= 0) {
		return;
	}
	const file = fileElem.files[0];
	var reader = new FileReader();
	reader.addEventListener('load', event => {
		const bytes = new Uint8Array(event.target.result);
			
		asyncOperation("POST", gToken.accessToken, endpoint, bytes, uploadImageResult);
	});
	reader.readAsArrayBuffer(file);
	document.getElementById("uploadButton").disabled = true;
}

function uploadImageResult(res){
	console.log("uploadImageResult is " + res);
	var div = document.getElementById("result");
	if(div){
		if(res){
			div.textContent = "Image upload is success.";
		} else {
			div.textContent = "Image upload is failure!";
		}
	}else{
		if(res){
			createTextwithID(area, "result", "Image upload is success.");
		} else {
			createTextwithID(area, "result", "Image upload is failure!");
		}
	}
	document.getElementById("uploadButton").disabled = false;
}

async function deployment(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId 
		+ "/devicegroups/" + gCurrGroup.id + "/deployments";
	var content = document.getElementById("imageIDsBox").value;

	document.getElementById("deployButton").disabled = true;
	await asyncOperation("POST", gToken.accessToken, endpoint, content, deploymentResult);
}

function deploymentResult(res){
	console.log("deploymentResult is " + res);
	var div = document.getElementById("result");
	if(div){
		if(res){
			div.textContent = "Deployment is success.";
		} else {
			div.textContent = "Deployment is failure!";
		}
	}else{
		if(res){
			createTextwithID(area, "result", "Deployment is success.");
		} else {
			createTextwithID(area, "result", "Deployment is failure!");
		}
	}
	document.getElementById("deployButton").disabled = false;
}


function deploymentArea(){
	clearArea();
	const area = document.getElementById("area");

	if(!gCurrGroup){
		createText(area, "Deployment group is not selected!");
		return;
	}

	createText(area, "TargetGroup:");
	createTextwithID(area, "groupName", gCurrGroup.textContent);
	createText(area, "imagepackage:");
	createUploatFileForm(area, "imagepackagePath");
	createBotton(area, "uploadButton", uploadImage, "UPLOAD");
	createLineBreak(area);
	createText(area, "[imageIDs]:");
	createTextBox(area, "imageIDsBox", "");
	createBotton(area, "deployButton", deployment, "DEPLOYMENT");
}


