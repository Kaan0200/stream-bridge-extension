import { credentialsProvider, finalizeLogin, init, initializeLogin } from "@tidal-music/auth";
import React from "react";

const ExchangeCodeDisplayID = "exchange-code";
const SearchResultDisplayID = "search-out";

const clientID: string = "wzkJ9EGRVZyio8l2";

function ButtonStyleObject(color: string) {
  return {
    width: 120,
    height: 48,
    backgroundColor: color,
    color: "white",
    borderStyle: "none",
    borderRadius: 8,
    cursor: "pointer"
  }
}
const styleRow = { padding: "0.5rem" }

export default function OptionsPage(): React.JSX.Element {
  // Check if authed
  init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode"
  }).then(async () => {
    const credentials = await credentialsProvider.getCredentials();
    document.getElementById(ExchangeCodeDisplayID).innerText = 
      `TIDAL UserID: ${credentials.userId}`;
  });


  return (
    <div
      style={{
        padding: "4rem",
        display: "flex",
        flexDirection: "column"
      }}>
      <h2>Options</h2>
      <div id={ExchangeCodeDisplayID} 
        style={{wordWrap: 'break-word'}}>Login status...</div>
      <div style={styleRow}>
        <button
          onClick={() => TidalLoginFlow()}
          style={ButtonStyleObject("black")}>
          Login to TIDAL
        </button>
      </div>
      <div style={styleRow}>
        <button
          onClick={() => ExchangeToken()}
          style={ButtonStyleObject("black")}>
          Exchange Token
        </button>
      </div>
      <div style={styleRow}>
        <button
          onClick={() => DoSearch()}
          style={ButtonStyleObject("grey")}>
          Fire Search
        </button>
      </div>
    </div>
  )
}

async function TidalLoginFlow() {
  const redirectUri = chrome.identity.getRedirectURL("oauth2");

  await init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode"
  });

  const loginUrl = await initializeLogin({
    redirectUri: redirectUri
  });

  console.log(`[EXTENSION] firing login flow: ${loginUrl}`)
  chrome.identity.launchWebAuthFlow(
    {
      url: loginUrl,
      interactive: true
    },
    (callbackURL) => {
      // login did not return the needed callbackURL
      if (callbackURL === undefined) {
        console.error("[EXTENSION-ERROR] callbackUrlString is undefined");
        return
      }
      console.log(`returned url: ${callbackURL}`);
      (document.getElementById(ExchangeCodeDisplayID) as HTMLDivElement).innerText = callbackURL;

      // login flow returned with Authorization code
      const token = callbackURL.substring(
        callbackURL.indexOf("="),
        callbackURL.indexOf("&")
      )

      chrome.storage.local.set({
        "tidal-token": token
      })
    }
  )
}

async function ExchangeToken() {
  const query = (
    document.getElementById(ExchangeCodeDisplayID) as HTMLDivElement
  ).innerText.split("?")[1];

  await init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode"
  })

  finalizeLogin(query).then(async () => {
    const credentials = await credentialsProvider.getCredentials();
    console.log("Retrieved Credentials.");
    console.log(credentials);
    chrome.storage.session.set({
      tidal: {
        userId: credentials.userId,
        token: credentials.token,
      }
    })
  })
  
}

async function DoSearch() {
  const credentials = await credentialsProvider.getCredentials();

  const TidalSearchBase = 'https://tidal.com/track';
  const TidalAPIBase = 'https://openapi.tidal.com/v2';
  const targetUrl = encodeURI(`${TidalAPIBase}/searchResults/kaiserdisco devon/relationships/tracks?countryCode=US&include=tracks`);

  const authString: string = "Bearer " + (credentials.token as String);
  const request = new Request(targetUrl);
  request.headers.append("Authorization", authString);
  request.headers.append("Accept", "application/vnd.api+json");
  
  fetch(request)
  .then(async (response) => {
      console.log("API Response");
      const responseData = await response.json();
      console.log(responseData.data);
      const targetTrackID = responseData.data[0].id;
      const targetTrackURL = TidalSearchBase + "/" + targetTrackID;
      document.getElementById(SearchResultDisplayID).innerText = "targeting url " +  targetTrackURL;

      window.open(targetTrackURL , "_self");

  });
}