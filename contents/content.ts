import type { PlasmoCSConfig } from "plasmo"
import LinkButton from "./components";

export const config: PlasmoCSConfig = {
  matches: ["https://www.beatport.com/*"],
  world: "MAIN",
  run_at: "document_start"
}


let target = document.querySelector('[title="Collection controls"]');

let newButton = new HTMLButtonElement();
newButton.textContent = "Fire!!"
target.insertAdjacentElement('afterend', newButton);