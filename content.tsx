import { sendToBackground } from "@plasmohq/messaging";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";
import { Menu } from '@base-ui-components/react';
import { renderToStaticMarkup } from 'react-dom/server';

export const config: PlasmoCSConfig = {
    matches: ['https://www.beatport.com/release/**'],
}

/**
 * [Plasmo Framework Function]
 * Function that tells plasmo how to mount it's shadow-dom container
 * @returns 
 */
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
    element: document.querySelector('[data-testid="play-button"]'),
    insertPosition: 'afterend'
})

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
async function FindOnTidal() {

    // Collect Search Information for Clicking on Link
    let artistLinkNodes: NodeListOf<ChildNode> = document.querySelector('[data-testid="release-artist-list"]').childNodes;
    const artistName = (artistLinkNodes[0] as HTMLLinkElement).title;

    let [ , typeName, releaseName] = location.pathname.split("/");
    const albumName = releaseName;

    sendToBackground({
        name: 'tidal',
        body: {
            artist: artistName,
            album: albumName
        }
    });
}

/**
 * [React Component]
 * Button component that attaches to the content and gives the user options
 * of playing the release on other streaming services
 * @returns 
 */
const LinkButton: () => JSX.Element = () => {
    return (
        <button id="ext-stream-bridge-button">
            <span id="ext-stream-default" onClick={() => FindOnTidal()}>
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
                            <Menu.Item className="">Find on Tidal</Menu.Item>
                            <Menu.Item className="">Find on Spotify</Menu.Item>
                        </Menu.Popup>
                    </Menu.Positioner>
                </Menu.Portal>
            </Menu.Root>
        </button>
    )
}

export default LinkButton;