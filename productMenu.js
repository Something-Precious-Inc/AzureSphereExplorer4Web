async function createProduct(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/products";
	var content = {};
	content["CreateDefaultGroups"]=document.getElementById("defGroupYes").checked;
	content["Description"]=document.getElementById("descTextBox").value;
	content["Name"]=document.getElementById("nameTextBox").value;

	// create button is disable
	document.getElementById("createProductButton").disabled = true;
	await asyncOperation("POST", gToken.accessToken, endpoint, JSON.stringify(content), createProductResult);
}

async function createProductResult(res){
	console.log("createProductResult is " + res);
	var div = document.getElementById("result");
	if(div){
		if(res){
			div.textContent = "Product create is success.";
		} else {
			div.textContent = "Product create is failure!";
		}
	}else{
		if(res){
			createTextwithID(area, "result", "Product create is success.");
		} else {
			createTextwithID(area, "result", "Product create is failure!");
		}
	}

	// product and group update
	if(res){
		await updateProductAndGroup();
		selectTopProduct();
	}
	document.getElementById("createProductButton").disabled = false;
}

function createProductArea(){
	clearArea();
	const area = document.getElementById("area");
	createText(area, "Name:");
	createTextBox(area, "nameTextBox", "testProduct");
	createLineBreak(area);
	createText(area, "Description:");
	createTextBox(area, "descTextBox", "");
	createLineBreak(area);
	createText(area, "CreateDefaultGroups:");
	createRadioButton(area, "defGroup", "defGroupYes", "Yes", true);
	createRadioButton(area, "defGroup", "defGroupNo", "No", false);
	createLineBreak(area);
	createBotton(area, "createProductButton", createProduct, "CREATE");
}

async function deleteProduct(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/products/" + gCurrProduct.id;

	document.getElementById("deleteProductButton").disabled = true;
	await asyncOperation("DELETE", gToken.accessToken, endpoint, "", deleteProductResult);

}

async function deleteProductResult(res){
	console.log("deleteProductResult is " + res);
	var div = document.getElementById("result");
	if(div){
		if(res){
			div.textContent = "Product delete is success.";
		} else {
			div.textContent = "Product delete is failure!";
		}
	}else{
		if(res){
			createTextwithID(area, "result", "Product delete is success.");
		} else {
			createTextwithID(area, "result", "Product delete is failure!");
		}
	}

	// product and group update
	if(res){
		await updateProductAndGroup();
		selectTopProduct();
	}
	document.getElementById("deleteProductButton").disabled = false;
}

function deleteProductArea(){
	clearArea();
	const area = document.getElementById("area");

	if(!gCurrProduct){
		createText(area, "Delete product is not selected!");
		return;
	}

	createText(area, "Delete product is ");
	createTextwithID(area, "productName", gCurrProduct.textContent);
	createLineBreak(area);
	createBotton(area, "deleteProductButton", deleteProduct, "DELETE");
}
