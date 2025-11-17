import { credentialsProvider, init } from "@tidal-music/auth"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const clientID: string = "wzkJ9EGRVZyio8l2"

const TidalAppTrackBase = "https://tidal.com/track"
const TidalAppSearchBase = "https://tidal.com/search"
const TidalAPIBase = "https://openapi.tidal.com/v2"

/**
 * Route the Tidal Command
 * @param req
 * @param res
 */
const tidal: PlasmoMessaging.MessageHandler = (req, res) => {
  const { artist, album, command } = req.body
  let URLPromise: Promise<string>

  switch (command) {
    case "stream": {
      URLPromise = OpenOnTidal(artist, album)
      break
    }
    // go to tidal search results
    case "search": {
      URLPromise = SearchOnTidal(artist, album)
      break
    }
    case "status": {
      URLPromise = TidalLoginStatus()
      break
    }
    default: {
      console.error("🌊 Unknown command sent to tidal background.")
      break
    }
  }

  URLPromise.then((finalURL) => {
    res.send(finalURL)
  })
}

export async function TidalLoginStatus(): Promise<string> {
  const initCheck = await init({
    clientId: clientID,
    credentialsStorageKey: "authorizationCode",
    scopes: []
  })

  const credentials = await credentialsProvider.getCredentials()

  console.log(credentials)
  return credentials.token ? "Received Token" : "Empty"
}

export async function OpenOnTidal(
  artist: string,
  album: string
): Promise<string> {
  console.log("🌊🟢 starting open...")

  const Credentials = await chrome.storage.sync.get("tidal")
  let finalUrl: string = ""
  // build request
  const targetUrl = encodeURI(
    `${TidalAPIBase}/searchResults/${artist} ${album}/relationships/tracks?countryCode=US&include=tracks`
  )
  const authString: string = "Bearer " + (Credentials?.tidal?.token as String)
  const request = new Request(targetUrl)
  request.headers.append("Authorization", authString)
  request.headers.append("Accept", "application/vnd.api+json")

  // do search
  const response = await fetch(request)
  console.log("search results....")
  const responseData = await response.json()

  // check for errors
  if (responseData.errors) {
    throw new Error("Unauthenticated with Tidal")
  } else {
    const firstChoice = responseData?.data[0]?.id
    finalUrl = encodeURI(`${TidalAppTrackBase}/${firstChoice}`)
  }

  // send final URL
  return finalUrl
}

export async function SearchOnTidal(
  artist: string,
  album: string
): Promise<string> {
  const targetUrl = encodeURI(`${TidalAppSearchBase}?q=${artist} ${album}`)
  return targetUrl
}

export default tidal
