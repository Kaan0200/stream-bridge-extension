import type { PlasmoMessaging } from "@plasmohq/messaging"

const spotify: PlasmoMessaging.MessageHandler = (req, res) => {
  const { artist, album, command } = req.body
  let URLPromise: Promise<string>

  switch (command) {
    case "stream": {
      URLPromise = OpenOnSpotify(artist, album)
      break
    }
  }
  URLPromise.then((finalURL) => {
    res.send(finalURL)
  })
}

export async function OpenOnSpotify(artist: string, album: string) {
  return ""
}

export default spotify
