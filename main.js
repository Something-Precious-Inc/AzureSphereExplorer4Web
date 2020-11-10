let username = "";

let gCurrTenantId = "";
let gTenants	= []; // in Tenant
let gProducts	= []; // in Product
let gCurrProduct;
let gGroups		= []; // in Group
let gCurrGroup;
let gDevices	= []; // in Device
let gToken;

function Tenant(tenant){
	this.Id = tenant.Id;
	this.Name = tenant.Name;
}

function Product(product){
	this.Id = product.Id;
	this.Name = product.Name;
}

function Group(group){
	this.Id = group.Id;
	this.Name = group.Name;

	for(var i=0; i<gProducts.length;i++){
		if(gProducts[i].Id == group.ProductId){
			this.Product = gProducts[i].Name;
			break;
		}
	}
}

function Device(dev){
	this.Id = dev.DeviceId;
	this.Name = dev.DeviceId;

	for(var i=0; i<gGroups.length;i++){
		if(gGroups[i].Id == dev.DeviceGroupId){
			this.DeviceGroup = gGroups[i].Name;
			this.Product = gGroups[i].Product;
			break;
		}
	}
}

function printTenants(response) {
	console.log(JSON.stringify(response));
	var select = document.getElementById("tenantList");

	for(i= 0; i< response.length; i++){
		console.log(response[i].Name);
		var tenant = new Tenant(response[i]);
		var opt = document.createElement("option");
		opt.value = tenant.Id;
		opt.text = tenant.Name;
		select.add(opt, null);
		gTenants.push(tenant);
	}

	document.getElementById("tenantSelectButton").disabled = false;
}

function Clear(){
	ClearList(document.getElementById("productList"));
	ClearList(document.getElementById("groupList"));
	ClearList(document.getElementById("deviceList"));
}

function ClearList(list){
	while(list.childElementCount>0){
		list.removeChild(list.firstElementChild);
	}
}

async function tenantSelect() {
	var num = document.getElementById("tenantList").selectedIndex;
	var id = document.getElementById("tenantList").options[num].value;

	// change tenant
	if(gCurrTenantId != id){
		gCurrTenantId = id;
		Clear();
	} else {
		return; // no change
	}

	document.body.style.cursor='wait';

	await updateProducts();
	await updateGroups();
	await updateDevices();
	extractProduct();

	// top product
	selectTopProduct();
	// top group
	selectTopGroup();
	document.body.style.cursor='auto';
}

function getProducts(response) {
	console.log(JSON.stringify(response));
	gProducts.length = 0; // product clear

	// create product list
	for(i= 0; i< response.Items.length; i++){
		console.log(response.Items[i].Name);
		var pro = new Product(response.Items[i]);
		gProducts.push(pro);
	}
}

function getGroups(response) {
	console.log(JSON.stringify(response));
	gGroups.length = 0; // group clear

	// create group list
	for(i= 0; i< response.Items.length; i++){
		console.log(response.Items[i].Name);
		var group = new Group(response.Items[i]);
		gGroups.push(group);
	}
}

function getDevices(response) {
	console.log(JSON.stringify(response));
	gDevices.length = 0;

	// create device list
	for(i= 0; i< response.Items.length; i++){
		console.log(response.Items[i].Name);
		var dev = new Device(response.Items[i]);
		gDevices.push(dev);
	}
}

function selectTopProduct(){
	var list = document.getElementById("productList");
	if(list.childElementCount > 0){
		list.firstElementChild.selected = true;
		list.firstElementChild.style.backgroundColor = "lime";
		gCurrProduct = list.firstElementChild;
		SelectExtractProduct(gCurrProduct);
	}
}

function selectTopGroup(){
	var list = document.getElementById("groupList");
	if(list.childElementCount > 0){
		list.firstElementChild.selected = true;
		list.firstElementChild.style.backgroundColor = "lime";
		gCurrGroup = list.firstElementChild;
		SelectExtractGroup(gCurrGroup);
	}
}

function SelectDevice(li){
	if(!li.selected){
		li.selected = true;
		li.style.backgroundColor="lime";
	}else {
		li.selected = false;
		li.style.backgroundColor="Transparent";	
	}
}

async function updateProductAndGroup(){
	await updateProducts();
	await updateGroups();
	extractProduct();
}

async function updateProducts(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/products";
	var list = document.getElementById("productList");

    await asyncPublicAPI("GET", gToken.accessToken, endpoint, "", getProducts);
}

async function updateGroups(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/devicegroups";
	var list = document.getElementById("groupList");

	await asyncPublicAPI("GET",gToken.accessToken, endpoint, "", getGroups);
}

async function updateDevices(){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/devices";
	var list = document.getElementById("deviceList");

	await asyncPublicAPI("GET",gToken.accessToken, endpoint, "", getDevices);
}

function extractProduct(){
	Clear();
	var list = document.getElementById("productList");

	// all product 
	for(i= 0; i< gProducts.length; i++){
		var li = document.createElement("li");
		li.textContent = (gProducts[i].Name);
		li.setAttribute("id", gProducts[i].Id);
		li.setAttribute("selected", false);
		li.onclick=function(){SelectExtractProduct(this);}
		list.appendChild(li);
	}
}

// select product 
function SelectExtractProduct(li){
	var children = document.getElementById("productList").children;
	var list = document.getElementById("groupList");
	ClearList(list);
	ClearList(document.getElementById("deviceList"));
	gCurrProduct = li;

	for(var i=0; i<children.length;i++){
		children[i].style.backgroundColor="Transparent";
	}
	li.style.backgroundColor="lime";

	for(var i=0; i<gGroups.length;i++){
		if(li.textContent == gGroups[i].Product){
			var elem = document.createElement("li");
			elem.textContent = (gGroups[i].Name);
			elem.setAttribute("id", gGroups[i].Id);
			elem.onclick=function(){SelectExtractGroup(this);}
			list.appendChild(elem);
		}
	}

	var div = document.getElementById("productName");
	if(div){
		div.textContent = li.textContent;
	}

	// top group 
	selectTopGroup();
}

// select group 
function SelectExtractGroup(li){
	var children = document.getElementById("groupList").children;
	var list = document.getElementById("deviceList");
	ClearList(list);
	gCurrGroup = li;

	for(var i=0; i<children.length;i++){
		children[i].style.backgroundColor="Transparent";
	}
	li.style.backgroundColor="lime";

	for(var i=0; i<gDevices.length;i++){
		if(li.textContent == gDevices[i].DeviceGroup 
			&& gDevices[i].Product == gCurrProduct.textContent){
			var elem = document.createElement("li");
			elem.textContent = (gDevices[i].Name);
			elem.setAttribute("id", gDevices[i].Id);
			elem.onclick=function(){SelectDevice(this);}
			list.appendChild(elem);
		}
	}

	var div = document.getElementById("groupName");
	if(div){
		div.textContent = li.textContent;
	}
}