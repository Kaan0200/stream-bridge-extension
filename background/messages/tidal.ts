import type { PlasmoMessaging } from "@plasmohq/messaging";

const TidalAPIBase = 'https://openapi.tidal.com/v2';


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {

    const targetUrl = encodeURI(`${TidalAPIBase}/searchResults/${req.body.artist} ${req.body.album}/relationships/tracks?countryCode=US&include=tracks`);

    chrome.storage.local.get('tidal-token', (data) => {
        const token = data['tidal-token'];

        if (token) {
            const authString: string = "Bearer " + (token as String).slice(1);
            const request = new Request(targetUrl);
            request.headers.append("Authorization", authString);
            request.headers.append("accept", "application/vnd.api+json");



            //console.log(token);
      
        fetch(request)
        .then((response) => {
            console.log("API Response");
            console.log(response);
        })
          }
    })

}

export default handler;