const TOKEN = "406213193:AAHXEJ5a91fstPv2T34wpAMxKeEB595QzWY";
let express = require('express');
let app = express();
var port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", function() {
    console.log("Listening on Port 3000");
});

const TelegramBot = require('node-telegram-bot-api');
var unirest = require('unirest');

const LASTURL = 'http://rasp.kl.com.ua/web/dhts/last';
const LASTURLBMP = 'http://rasp.kl.com.ua/web/bmps/last';


const bot = new TelegramBot(TOKEN, {polling: true});


bot.onText(/\/last/, (msg, match) => {
   var userId = msg.chat.id;
   var temperature;
   var humidity;
    unirest.post(LASTURL)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(response => {
            var resp = response.body;
            temperature = resp.Temperature;
            humidity = resp.Humidity;
            //bot.sendMessage(userId,`Temperature ${response.Temperature} Humidity: ${response.Humidity} at ${response.Created_at}`);
           // bot.sendMessage(userId,`Temperature: ${resp.Temperature} Humidity: ${resp.Humidity} at ${resp.Created_at}`);

        });

    unirest.post(LASTURLBMP)
        .header({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(response => {
            var resp = response.body;
            bot.sendMessage(userId,`Temperature: ${temperature}°C Humidity: ${humidity}% Pressure ${resp.Pressure/100} kPa at ${resp.Created_at}`);

        });

});

bot.onText(/\/today/,(msg,match) => {
   var userId = msg.chat.id;

});

bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

