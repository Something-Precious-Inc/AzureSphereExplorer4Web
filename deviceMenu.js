async function changeGroup(){
	var children = document.getElementById("changeDeviceList").children;
	document.getElementById("changeButton").disabled = true;
	
	for(i = 0; i < children.length; i++){
		if(children[i].selected){
			var deviceId = children[i].id;	
			var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId 
				+ "/devices/" + deviceId + "/devicegroup";
			var content = "\"" + gCurrGroup.id + "\"";

		    await asyncOperation("PUT", gToken.accessToken, endpoint, content, changeGroupResult);
		}
	}
	await updateDevices();
	await SelectExtractGroup(gCurrGroup)
	createChangeGroupList(document.getElementById("area"));
	document.getElementById("changeButton").disabled = false;
}

function changeGroupResult(res){
	console.log("changeGroupResult is " + res);
}

function createChangeGroupList(area){
	var list = document.getElementById("changeDeviceList");
	var add = true;
	if(list){
		ClearList(list);
		add = false;
	} else {
		list = document.createElement("div");
		list.setAttribute("id","changeDeviceList");
	}

	for(i= 0; i< gDevices.length; i++){
		var li = document.createElement("li");
		li.textContent = (gDevices[i].DeviceGroup+"/"+gDevices[i].Name);
		li.id = gDevices[i].Id;
		li.onclick=function(){SelectDevice(this);}
		list.appendChild(li);
	}

	if(add){
		area.appendChild(list);
	}
}

function changeGroupArea(){
	clearArea();
	const area = document.getElementById("area");

	createText(area, "Target Group: ");
	if(gCurrGroup){
		createTextwithID(area, "groupName", gCurrGroup.textContent);
	}else{
		createTextwithID(area, "groupName", "Target group is not selected!");
	}
	createChangeGroupList(area);
	createLineBreak(area);
	createBotton(area, "changeButton", changeGroup, "CHANGE");
}