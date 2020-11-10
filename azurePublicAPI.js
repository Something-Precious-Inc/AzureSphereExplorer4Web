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