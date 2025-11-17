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
    .selected {
      background-color: grey;
    }
  `

  return (
    <>
      <style>{css}</style>
      <div className="page">
        <h1>Settings</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "14rem" }}>
            <div
              className={"category top " + (currentTab == 0 && "selected")}
              onClick={() => setTab(0)}>
              General
            </div>
            <div
              className={"category " + (currentTab == 1 && "selected")}
              onClick={() => setTab(1)}>
              Tidal
            </div>
            <div
              className={"category bottom  " + (currentTab == 2 && "selected")}
              onClick={() => setTab(2)}>
              Spotify
            </div>
          </div>
          {currentTab == 0 && (
            <>
              <div style={{ flexGrow: 2, margin: "2rem" }}>
                <h2>Default Streaming Service</h2>
                <div>
                  Which streaming service to use when clicking the "Stream"
                  button on websites.{" "}
                </div>
                <select>
                  <option>Tidal</option>
                  <option>Spotify</option>
                </select>
              </div>
            </>
          )}
          {currentTab == 1 && (
            <>
              <div style={{ flexGrow: 2 }}>
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
              </div>
              <div style={{ flexGrow: 2 }}>
                <div
                  id={ExchangeCodeDisplayID}
                  style={{ wordWrap: "break-word" }}>
                  Login status...
                </div>
              </div>
            </>
          )}
          {currentTab == 2 && (
            <>
              <h2>Coming Soon...</h2>
            </>
          )}
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
