import type { PlasmoCSConfig } from "plasmo";

export const config: PlasmoCSConfig = {
    matches: ['https://www.beatport.com/*'],
    world: "MAIN",
}

const LinkButton = () => {
    return <button>Link To</button>
}

export default LinkButton;