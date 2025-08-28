import type { PlasmoCSConfig } from "plasmo";
import { renderToStaticMarkup } from 'react-dom/server';

export const config: PlasmoCSConfig = {
    matches: ['https://www.beatport.com/*'],
    world: "MAIN",
}

const LinkButton: () => JSX.Element = () => {
    return <button>Link To</button>
}

console.log("Attempting Match...");
let target = document.querySelector('[data-testid="play-button"]');
if (target) {
    console.log('found');
    console.log(target);
    target.parentElement.insertAdjacentHTML('afterend', renderToStaticMarkup(LinkButton()));
}

export default LinkButton;