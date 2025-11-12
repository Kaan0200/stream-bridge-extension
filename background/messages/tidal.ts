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
  return ""
}

export async function OpenOnTidal(
  artist: string,
  album: string
): Promise<string> {
  console.log("🌊🟢 starting open...")
  try {
    const initCheck = await init({
      clientId: clientID,
      credentialsStorageKey: "authorizationCode",
      scopes: []
    })
    console.log("🌊🟡 after init...")
    console.log(initCheck)
  } catch (ex) {
    return "x: Could not init"
  }
  const credentials = await credentialsProvider.getCredentials()
  console.log("🌊🟡 after auth...")
  console.log(credentials)

  // build request
  const targetUrl = encodeURI(
    `${TidalAPIBase}/searchResults/${artist} ${album}/relationships/tracks?countryCode=US&include=tracks`
  )
  const authString: string = "Bearer " + (credentials.token as String)
  const request = new Request(targetUrl)
  request.headers.append("Authorization", authString)
  request.headers.append("Accept", "application/vnd.api+json")

  // do search
  const response = await fetch(request)
  const firstChoice = response.body[0]
  const finalUrl = encodeURI(`${TidalAppTrackBase}/${firstChoice}`)

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
