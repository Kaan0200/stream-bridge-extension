import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig } from "plasmo";
import { renderToStaticMarkup } from 'react-dom/server';

export const config: PlasmoCSConfig = {
    matches: ['https://www.beatport.com/*'],
}


async function FindOnTidal() {
    sendToBackground({
        name: 'tidal',
        body: {
            artist: artistName,
            album: albumName
        }
    });
}

const LinkButton: () => JSX.Element = () => {
    return <button 
        onClick={() => FindOnTidal()} 
        id="ext-stream-bridge-button"
    >Link To</button>
}


/**
 * Execute on Content
 */

// Add "Link To" button to Website
let target = document.querySelector('[data-testid="play-button"]');
if (target) {
    console.log('found');
    console.log(target);
    target.parentElement.insertAdjacentHTML('afterend', renderToStaticMarkup(LinkButton()));
}
// Collect Search Information for Clicking on Link
let artistLinkNodes: NodeListOf<ChildNode> = document.querySelector('[data-testid="release-artist-list"]').childNodes;
const artistName = (artistLinkNodes[0] as HTMLLinkElement).title;

let [ , typeName, releaseName] = location.pathname.split("/");
const albumName = releaseName;

export default LinkButton;