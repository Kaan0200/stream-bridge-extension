import { useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

/**
 * Function that builds the index popup, because it is the default export
 * plasmo knows what to do with this file.
 * @returns JSX of the Popup window
 */
export default function IndexPopup(): JSX.Element {
  const [data, setData] = useState("")

  return (
    <div
      style={{
        width: 160,
        marginLeft: 16,
        marginRight: 16,
        marginTop: 32,
        marginBottom: 32
      }}>
      <h2>Stream Bridge</h2>
      <div>
        Tidal Login Status: <span id="tidal-status">⭕</span>
      </div>
    </div>
  )
}

async function UpdateTidalLoginStatus() {
  console.log("checking tidal login status...")
  const response = await sendToBackground({
    name: "tidal",
    body: {
      command: "status"
    }
  })
}

// Update when the popup is opened.
UpdateTidalLoginStatus()
