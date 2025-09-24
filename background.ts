import type { IMessage } from "~types/message";

const TidalAPIBase = 'https://tidal-music.github.io';

console.log("background is alive!!");

chrome.runtime.onMessage.addListener(handleMessage);

function handleMessage(message: IMessage) {
    if (message.action === 'search-tidal') {
        FindOnTidal(message.artist, message.album);
    } else {
        console.error("[StreamBridge] Unknown message from content script");
    }
}

function FindOnTidal(artist: string, release: string) {
    const targetUrl = `${TidalAPIBase}/${artist} ${release}/relationships/tracks`
    console.log("attempting to search...");
    console.log(targetUrl);
    fetch(targetUrl)
        .then((response) => {
            console.log("API Response");
            console.log(response);
        })
}