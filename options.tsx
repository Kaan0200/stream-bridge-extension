import {
  credentialsProvider,
  finalizeLogin,
  init,
  initializeLogin
} from "@tidal-music/auth"
import React, { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

const ExchangeCodeDisplayID = "exchange-code"
const SearchResultDisplayID = "search-out"

const clientID: string = "wzkJ9EGRVZyio8l2"

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
  const [currentTab, setTab] = useState(0)

  // Check if authed
  init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode"
  }).then(async () => {
    const credentials = await credentialsProvider.getCredentials()
    document.getElementById(ExchangeCodeDisplayID).innerText =
      `TIDAL UserID: ${credentials.userId}`
  })
  const css = `
    .category {
        padding: 3rem;
        font-size: 1rem;
    }
    .page {
      margin: 4rem;
    }
  `

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <h1>Settings</h1>
        <div style={{ display: "flex" }}>
          <div>
            <div className="category top" onClick={() => setTab(0)}>
              General {currentTab == 0 && <>🟢</>}
            </div>
            <div className="category" onClick={() => setTab(1)}>
              Tidal {currentTab == 1 && <>🟢</>}
            </div>
            <div className="category bottom" onClick={() => setTab(2)}>
              Spotify {currentTab == 2 && <>🟢</>}
            </div>
          </div>
          <div style={{ width: "600px" }}>
            <div id={ExchangeCodeDisplayID} style={{ wordWrap: "break-word" }}>
              Login status...
            </div>
            <div style={styleRow}>
              <button
                onClick={() => TidalLogin()}
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
                onClick={() => ExchangeToken()}
                style={ButtonStyleObject("purple")}>
                Refresh Token
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
        </div>
      </div>
    </>
  )
}

async function TidalLogin() {
  const redirectUri = chrome.identity.getRedirectURL("oauth2")

  await init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode"
  })

  const loginUrl = await initializeLogin({
    redirectUri: redirectUri
  })

  chrome.identity.launchWebAuthFlow(
    {
      url: loginUrl,
      interactive: true
    },
    (callbackURL) => {
      // login did not return the needed callbackURL
      if (callbackURL === undefined) {
        console.error("🔴: AuthFlow did not return callback URL")
        return
      }

      const token = callbackURL.substring(callbackURL.indexOf("?") + 1)

      finalizeLogin(token).then(async () => {
        const credentials = await credentialsProvider.getCredentials()

        chrome.storage.sync.set({
          tidal: {
            userId: credentials.userId,
            token: credentials.token
          }
        })
      })
    }
  )
}

async function ExchangeToken() {
  const query = (
    document.getElementById(ExchangeCodeDisplayID) as HTMLDivElement
  ).innerText.split("?")[1]

  await init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode"
  })

  finalizeLogin(query).then(async () => {
    const credentials = await credentialsProvider.getCredentials()
    console.log("Retrieved Credentials.")
    console.log(credentials)
    chrome.storage.sync.set({
      tidal: {
        userId: credentials.userId,
        token: credentials.token
      }
    })
  })
}

async function DoSearch() {
  const credentials = await credentialsProvider.getCredentials()

  const TidalSearchBase = "https://tidal.com/track"
  const TidalAPIBase = "https://openapi.tidal.com/v2"
  const targetUrl = encodeURI(
    `${TidalAPIBase}/searchResults/kaiserdisco devon/relationships/tracks?countryCode=US&include=tracks`
  )

  const authString: string = "Bearer " + (credentials.token as String)
  const request = new Request(targetUrl)
  request.headers.append("Authorization", authString)
  request.headers.append("Accept", "application/vnd.api+json")

  fetch(request).then(async (response) => {
    console.log("API Response")
    const responseData = await response.json()
    console.log(responseData.data)
    const targetTrackID = responseData.data[0].id
    const targetTrackURL = TidalSearchBase + "/" + targetTrackID
    document.getElementById(SearchResultDisplayID).innerText =
      "targeting url " + targetTrackURL

    window.open(targetTrackURL, "_self")
  })
}
