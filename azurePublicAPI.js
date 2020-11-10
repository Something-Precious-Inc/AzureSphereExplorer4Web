async function asyncPublicAPI(method, token, endpoint, content, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);
	headers.append("Content-Type", "application/json");

    var options = {
        method: method,
        headers: headers
    };

	if(content) {
		options["body"] = content;
	};

    return await fetch(endpoint, options)
        .then(response => response.json())
		.then(response => callback(response))
        .catch(error => console.log(error));
}

var StateNum =
{
	NotStarted:0,
	InProgress:1,
	Complete:2,
	Failed:3
};

let gLoop = true;
let gRet = true;

async function asyncOperation(method, token, endpoint, content, callback) {
	gLoop = true;
	await asyncPublicAPI(method, token, endpoint, content, callAsyncOperation);
	while(gLoop){
	}
	callback(gRet);
}

async function callAsyncOperation(response){
	console.log(JSON.stringify(response));
	return await AsyncOperation(response.OperationId);
}

async function AsyncOperation(opeId){
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants/" + gCurrTenantId + "/operations/" + opeId;
    return await asyncPublicAPI("GET", gToken.accessToken, endpoint, "", printOpe);

}

async function printOpe(response){
	console.log(JSON.stringify(response));
	
	switch(response.State){
		case StateNum.Complete:
			gRet = true;
			gLoop = false;
			break;
		case StateNum.Failed:
			gRet = false;
			gLoop = false;
			break;
		case StateNum.NotStarted:
		case StateNum.InProgress:
			break;
		default:
			gRet = false;
			gLoop = false;
			break;
	}

	if(gLoop){
		await AsyncOperation(response.OperationId);
	}

	return gRet;
}
