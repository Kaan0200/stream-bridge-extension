import type { PlasmoMessaging } from "@plasmohq/messaging";
import { credentialsProvider } from "@tidal-music/auth";

const TidalAPIBase = 'https://openapi.tidal.com/v2';


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {

    const targetUrl = encodeURI(`${TidalAPIBase}/searchResults/${req.body.artist} ${req.body.album}/relationships/tracks?countryCode=US&include=tracks`);

    const credentials = await credentialsProvider.getCredentials();

        if (credentials.token) {
            const authString: string = "Bearer " + (credentials.token as String);
            const request = new Request(targetUrl);
            request.headers.append("Authorization", authString);
            request.headers.append("Accept", "application/vnd.api+json");



            //console.log(token);
      
        fetch(request)
        .then((response) => {
            console.log("API Response");
            console.log(response);
        })   
    }
}

export default handler;