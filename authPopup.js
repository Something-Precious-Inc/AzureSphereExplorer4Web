// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

function loadPage() {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    const currentAccounts = myMSALObj.getAllAccounts();
    if (currentAccounts === null) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add choose account code here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
		document.body.style.cursor='wait';
        username = currentAccounts[0].username;
		getTenants();
        showWelcomeMessage(currentAccounts[0]);
		document.body.style.cursor='auto';
    }
}

function handleResponse(resp) {
    if (resp !== null) {
		document.body.style.cursor='wait';
        username = resp.account.username;
		getTenants();
        showWelcomeMessage(resp.account);
		document.body.style.cursor='auto';
    } else {
        loadPage();
    }
}

function signIn() {
    myMSALObj.loginPopup(loginRequest).then(handleResponse).catch(error => {
        console.error(error);
    });
	console.log("Sign in is success.");
}

function signOut() {
    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username)
    };

    myMSALObj.logout(logoutRequest);
}

function getTokenPopup(request) {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = myMSALObj.getAccountByUsername(username);
    
    return myMSALObj.acquireTokenSilent(request).catch(error => {
        console.warn("silent token acquisition fails. acquiring token using popup");
        if (error instanceof msal.InteractionRequiredAuthError) {
            // fallback to interaction when silent call fails
            return myMSALObj.acquireTokenPopup(request).then(tokenResponse => {
                console.log(tokenResponse);
                return tokenResponse;
            }).catch(error => {
                console.error(error);
            });
        } else {
            console.warn(error);   
        }
    });
}

function getTenants() {
	var endpoint = "https://prod.core.sphere.azure.net/v2/tenants";
    getTokenPopup(tokenRequest).then(response => {
		console.log(JSON.stringify(response));
		gToken = response;
        asyncPublicAPI("GET", response.accessToken, endpoint, "", printTenants);
    }).catch(error => {
        console.error(error);
    });
}

loadPage();
