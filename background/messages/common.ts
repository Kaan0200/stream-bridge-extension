import { PlasmoMessaging } from "@plasmohq/messaging"

import { OpenOnSpotify } from "./spotify"
import { OpenOnTidal } from "./tidal"

const clientID: string = "wzkJ9EGRVZyio8l2"

const TidalTrackBase = "https://tidal.com/track"
const TidalAPIBase = "https://openapi.tidal.com/v2"

/**
 * Open up the song in the default streaming service
 * @param req
 * @param res
 */
const common: PlasmoMessaging.MessageHandler = (req, res) => {
  const { artist, album, command } = req.body
  let URLPromise: Promise<string>

  // get the user setting for default streaming service
  const defaultStream: "tidal" | "spotify" = "tidal"

  switch (command) {
    case "stream": {
      URLPromise =
        defaultStream == "tidal"
          ? OpenOnTidal(artist, album)
          : OpenOnSpotify(artist, album)
      break
    }
  }

  URLPromise.then((finalURL) => {
    res.send(finalURL)
  })
}

export default common
