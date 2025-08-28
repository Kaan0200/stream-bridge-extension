import { useState } from "react"
import { finalizeLogin, init, initializeLogin } from "@tidal-music/auth/dist"

function IndexPopup() {


  const [data, setData] = useState("")

  return (
    <div
      style={{
        padding: 16
      }}>
      <h2>
        Stream Bridge
      </h2>
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
  console.log("firing login flow");
  await init({clientId: ClientID, credentialsStorageKey: 'authorizationCode'})
  
  const loginUrl = await initializeLogin({
   redirectUri: "https://login.tidal.com/"
  });

  //finalizeLogin()

  window.open(loginUrl, '_self');
}

export default IndexPopup
