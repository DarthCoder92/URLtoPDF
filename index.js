import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';
import apiToken from './token.js';
const app = express();
const port = 3000;




app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", (req, res) => {
    
    res.render("index.ejs", {
        pageState: "home",
    });
});

app.post("/convert", async (req, res ) => {
    
    const pdfLink = await getPDF(req.body.url);
    console.log("PDF Link: ", pdfLink);
    console.log(req.body.url);
    res.render("index.ejs", {
        pageState: "converted",
        pdfLink: pdfLink
    });

    
    
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


async function getPDF(url) {
const options = {
    "method": "POST",
    "url": "https://api.pdfendpoint.com/v1/convert",
    "headers": {
        "Content-Type": "application/json",
        "Authorization": apiToken
    },
    "data": JSON.stringify({
        "margin-top": "1cm",
        "margin-bottom": "1cm",
        "margin-left": "1cm",
        "margin-right": "1cm",
        "no_background": true,
        "url": url
    })
    
};
console.log("logging option variable" + options);

const response = await axios.request(options).then(function (response) {
    console.log(response.data);
    const pdfURL =  response.data.data.url;
    console.log("PDF URL: ", pdfURL);
    return pdfURL;
    

}).catch(function (error) {
    console.error("Error during PDF conversion:", error);
});

return response;



}