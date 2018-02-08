const TOKEN = "406213193:AAHXEJ5a91fstPv2T34wpAMxKeEB595QzWY";
let express = require('express');
let app = express();
var http = require('http').Server(app);
const socketIO = require('socket.io');
var port = process.env.PORT || 3000;
var temperature;
var humidity;


const io = socketIO(http);

io.on('connection', (socket) => {
    console.log('coneect');

    socket.on('test', (resp) => {
        console.log(resp);
        socket.emit('ttt', 'dfafs');
    });

    socket.on('critical', (resp) => {
        console.log(resp);
        let dat = JSON.stringify(resp);
        io.emit('changestate', dat);

    });
});

http.listen(port, function () {
    console.log("Listening on Port 3000");

});
const TelegramBot = require('node-telegram-bot-api');
var unirest = require('unirest');

const LASTURL = 'http://rasp.kl.com.ua/web/dhts/last';
const LASTURLBMP = 'http://rasp.kl.com.ua/web/bmps/last';

app.get('/', function (req, res) {

});

const bot = new TelegramBot(TOKEN, {polling: true});


bot.onText(/\/last/, (msg, match) => {
    var userId = msg.chat.id;

    unirest.post(LASTURL)
        .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(response => {
            var resp = response.body;
            //   temperature = resp.Temperature;
            //  humidity = resp.Humidity;
            //bot.sendMessage(userId,`Temperature ${response.Temperature} Humidity: ${response.Humidity} at ${response.Created_at}`);
            bot.sendMessage(userId, `Temperature: ${resp.Temperature} Humidity: ${resp.Humidity} at ${resp.Created_at}`);

        });

    unirest.post(LASTURLBMP)
        .header({'Accept': 'application/json', 'Content-Type': 'application/json'})
        .end(response => {
            var resp = response.body;
            bot.sendMessage(userId, `Pressure ${resp.Pressure / 100} kPa at ${resp.Created_at}`);

        });

});

bot.onText(/\/today/, (msg, match) => {
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

