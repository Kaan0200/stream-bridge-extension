import { PlasmoMessaging } from "@plasmohq/messaging";
import { OpenOnTidal } from "./tidal";


const clientID: string = "wzkJ9EGRVZyio8l2";

const TidalTrackBase = 'https://tidal.com/track';
const TidalAPIBase = 'https://openapi.tidal.com/v2';

/**
 * Open up the song in the default streaming service
 * @param req 
 * @param res 
 */
const common: PlasmoMessaging.MessageHandler = (req, res) => {

    // get the user settings
    const {artist, album, command} = req.body;

    OpenOnTidal(artist, album).then((response) => {
        return response;
    });
}

export default common;