import { init, initializeLogin } from "@tidal-music/auth";

    const SecretInputID = 'secret-input';

export default function OptionsPage() {

    return (
    <div>
        <h2>Options</h2>

        <div>
            <input id={SecretInputID} />
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
  const ClientID: string = "wzkJ9EGRVZyio8l2";
  let secretInput = document.getElementById(SecretInputID);
  console.log("firing login flow");
  await init({clientId: ClientID, clientSecret: secretInput.innerText, credentialsStorageKey: 'authorizationCode'})
  
  const loginUrl = await initializeLogin({
   redirectUri: "window.location.href"
  });

  //finalizeLogin()

  window.open(loginUrl, '_blank');
}