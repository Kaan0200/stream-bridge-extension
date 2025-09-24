import { finalizeLogin, init, initializeLogin } from "@tidal-music/auth";
import React from 'react';

const SecretInputID = 'secret-input';

export default function OptionsPage(): React.JSX.Element {

    return (
    <div style={{
      padding: "4rem",

      display: "flex",
      flexDirection: "column"
    }}>
        <h2>Options</h2>

        <div>
            <input id={SecretInputID} style={{width: 300}}/>
        </div>
        <div>  
        <button
            onClick={() => TidalLoginFlow()}
            style={{
              width: 120,
              height: 48,
              backgroundColor: "black",
              color: "white",
              borderStyle: "none",
              borderRadius: 8,
              cursor: "pointer",
            
            }}
        
        >
        Login to TIDAL
      </button>
      </div> <div>
      <button
        onClick={() => ExchangeToken()}
        style={{
          width: 120,
          height: 48,
          backgroundColor: "grey",
          color: "black",
          borderStyle: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
        >
          Exchange Token
      </button>
      </div>
    </div>
    )
}

async function TidalLoginFlow() {
  const clientID: string = "wzkJ9EGRVZyio8l2";
  const secretInput = (document.getElementById(SecretInputID) as HTMLInputElement).value;
  const redirectUri = chrome.identity.getRedirectURL("oauth2");

  await init({
    clientId: clientID,
    clientSecret: secretInput,
    credentialsStorageKey: 'authorizationCode'
  });

  
  const loginUrl = await initializeLogin({
   redirectUri: redirectUri
  });


  console.log(`[EXTENSION] firing login flow: ${loginUrl}`);
  chrome.identity.launchWebAuthFlow({
    url: loginUrl,
    interactive: true
  }, (callbackURL) => {
      // login did not return the needed callbackURL
      if (callbackURL === undefined) {
        console.error("[EXTENSION-ERROR] callbackUrlString is undefined")
        return
      }
      console.log(`returned url: ${callbackURL}`);

      // login flow returned with Authorization code
      const token = callbackURL.substring(callbackURL.indexOf('='), callbackURL.indexOf('&'));

      chrome.storage.local.set({
        'tidal-token': token
      });

      init({
        clientId: clientID,
        clientSecret: secretInput,
        credentialsStorageKey: 'authorizationCode'
      }).then(() => {
        finalizeLogin(callbackURL);
      });  
  })
}

async function ExchangeToken() {

}