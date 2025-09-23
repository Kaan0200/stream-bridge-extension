import { init, initializeLogin } from "@tidal-music/auth";
import React from 'react';



const SecretInputID = 'secret-input';

export default function OptionsPage(): React.JSX.Element {

    return (
    <div>
        <h2>Options</h2>

        <div>
            <input id={SecretInputID} style={{width: 300}}/>
        </div>
                    
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
      if (callbackURL === undefined) {
        console.error("[EXTENSION-ERROR] callbackUrlString is undefined")
        return
      } else {
        const token = callbackURL.substring(callbackURL.indexOf('='), callbackURL.indexOf('&'));

        console.log(`returned token: ${token}`);
        
        chrome.storage.local.set({
          'tidal-token': token
        });
      }
  }) 
}