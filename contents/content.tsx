import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";
import { Menu } from '@base-ui-components/react';

console.log("🌊 Content Script Waking Up...");

export const config: PlasmoCSConfig = {
    matches: ['https://www.beatport.com/release/*'],
}

/**
 * [Plasmo Framework Function]
 * Function that tells plasmo how to mount it's shadow-dom container
 * @returns 
 */
export const getInlineAnchor: PlasmoGetInlineAnchor = () => ({
    element: document.querySelector('[data-testid="play-button"]'),
    insertPosition: 'afterend'
});

/**
 * [Plasmo Framework Function]
 * Function that gives plasmo the <style> block to apply to it's shadow-dom container
 * @returns 
 */
export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style");
    style.textContent = `
        button  {
        	background: none;
        	color: inherit;
        	border: none;
        	padding: 0;
        	font: inherit;
        	cursor: pointer;
        	outline: inherit;
        }
        #ext-stream-bridge-button {
            display: flex;
            padding: 0;
            border-radius: 8px;
            color: white;
        }
        #ext-stream-default {
            background-color: #1E2338;
            line-height: 16px;
            font-size: 12px;
            padding: 0.25rem 0.5rem;
            font-weight: 500;
            border-radius: 4px 0 0 4px;
        }
        #ext-stream-default:hover {
            background-color: #293C7A;
        }
        #ext-stream-dropdown-anchor {
            padding: 0 0.25rem;
            background-color: #1E2C5B;
            border-radius: 0 4px 4px 0;
            cursor: pointer;
        }
        #ext-stream-dropdown-anchor:hover {
            background-color: #323B5D;
        }
    `;

    return style;
}


/**
 * 
 */
async function DefaultStream() {
    let artistLinkNodes: NodeListOf<ChildNode> = document.querySelector('[data-testid="release-artist-list"]').childNodes;
    const artistName = (artistLinkNodes[0] as HTMLLinkElement).title;
  
    let trackLinkNode = document.getElementsByTagName('h1');
    const albumName = trackLinkNode[0].innerText;
  
    sendToBackground({
        name: 'common',
        body: {
            command: 'default',
            artist: artistName,
            album: albumName
        }
    }).then((response) => {
        window.open(response, "_blank");
    });
  }

async function TidalSearch() {
    let artistLinkNodes: NodeListOf<ChildNode> = document.querySelector('[data-testid="release-artist-list"]').childNodes;
    const artistName = (artistLinkNodes[0] as HTMLLinkElement).title;
  
    let trackLinkNode = document.getElementsByTagName('h1');
    const albumName = trackLinkNode[0].innerText;
  
    const response = await sendToBackground({
        name: 'tidal',
        body: {
            command: 'search',
            artist: artistName,
            album: albumName
        }
    });
    window.open(response, "_blank");
}

async function TidalStream() {
    let artistLinkNodes: NodeListOf<ChildNode> = document.querySelector('[data-testid="release-artist-list"]').childNodes;
    const artistName = (artistLinkNodes[0] as HTMLLinkElement).title;
  
    let trackLinkNode = document.getElementsByTagName('h1');
    const albumName = trackLinkNode[0].innerText;
    
    const response = await sendToBackground({
        name: 'tidal',
        body: {
            command: 'stream', artist: artistName, album: albumName
        }
    })
    window.open(response, "_blank");

}

/**
 * [React Component]
 * Button component that attaches to the content and gives the user options
 * of playing the release on other streaming services
 * @returns 
 */
const LinkButton: () => JSX.Element = () => {
    // Styles for dropdown, which is not shadow-dom
    const style = document.createElement("style");
    style.textContent = `        
        #menu-bottom {
            background-color: #1E2C5B;
            border: 2px solid #2E2C5B;
            border-radius: 8px;
            padding: .5rem 0 .5rem 0;
        }
        .menu-item {
            padding: 0 .5rem 0 .5rem;
            cursor: pointer;
        }
        .menu-item:hover {
            background-color: #4E2C5B;
        }
        .menu-separator {
            margin: .25rem;
            height: 2px;
            background-color: #2E2C5B;
        }
    `;
    document.body.append(style);

    return (
        <button id="ext-stream-bridge-button">
            <span id="ext-stream-default" onClick={() => DefaultStream()}>
                🌊Stream
            </span>
            <Menu.Root>
                <Menu.Trigger>
                    <span id="ext-stream-dropdown-anchor" onClick={() => {}}>
                    🔻
                    </span>
                </Menu.Trigger>
                <Menu.Portal>
                    <Menu.Positioner>
                        <Menu.Popup id="menu-bottom">
                            <Menu.Item className="menu-item" onClick={() => TidalStream()}>Listen on Tidal</Menu.Item>
                            <Menu.Item className="menu-item strike">Listen on Spotify</Menu.Item>
                            <Menu.Separator className="menu-separator"></Menu.Separator>
                            <Menu.Item className="menu-item" onClick={() => TidalSearch()}>Search on Tidal</Menu.Item>
                            <Menu.Item className="menu-item strike">Search on Spotify</Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        </button>
    )
}

export default LinkButton;