// import library
const axios = require('axios');
const { Telegraf, Markup  } = require("telegraf");
const { message } = require("telegraf/filters");
require('dotenv').config()

// init bot 
const token = process.env.BOT;
const bot = new Telegraf(token);
const host = "https://rare-dodo-frank.ngrok-free.app";
// bot handlers
bot.start(async (ctx) => {
    ctx.reply("Hello " + ctx.from.first_name + "!");
    await new Promise(resolve => setTimeout(resolve, 500));
    ctx.reply("Welcome to the Algolink!");
    await new Promise(resolve => setTimeout(resolve, 500));
    ctx.reply("If you have a trouble with open Pera Algo Wallet when connecting, please try to follow these step:\n- Open Telegram setting\n- Choose Chat Settings\n- Turn off In-App Browser options\n- Try connecting again");
});

bot.command('connect', async (ctx) => {
    ctx.reply('Click button to open Pera Wallet Mobile and connect', Markup.inlineKeyboard([
        [Markup.button.url('Algolink Pera Wallet', host)]
    ]));
});

// https://rare-dodo-frank.ngrok-free.app/algolink?ORX7PDVSFMJ3RQLW5LWDQI66ZJAN3FAYYEBZYDKDCEQU33IPS3RKCNO64A
// https://rare-dodo-frank.ngrok-free.app/algolink?DTUA424DKCJYPHF5MLO6CL4R2BWOTH2GLOUQA257K5I7G65ENHSDJ4TTTE

/* bot.command('create', async (ctx) => {
    
    const response = await axios.get("http://localhost:80/api/actions/transfer-apt");
    console.log(response.data.title);
}); */

bot.on(message("text"), async (ctx) => {
    const messageText = ctx.message.text;
    const urlRegex = /https*:\/\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\.ngrok-free\.app\/algolink\?\w{58}$/mis;

    if (messageText.startsWith("/")) {
        return;
    }

    if (urlRegex.test(messageText) || urlRegexLocal.test(messageText)) {
        const parsedUrl = new URL(messageText);
        const urlHost = parsedUrl.hostname;
        console.log(urlHost);
        console.log(new URL(host).hostname);

        if (urlHost==new URL(host).hostname){
            const response = await axios.get("http://localhost:80/api/actions/transfer-apt");
            ctx.reply("Your've received an algolink");
            await new Promise(resolve => setTimeout(resolve, 100));
            ctx.replyWithPhoto(
                { url: response.data.icon },
                {
                  caption: response.data.description,
                  parse_mode: "Markdown",
                  ...Markup.inlineKeyboard([
                    Markup.button.url('Algolink', parsedUrl),
                  ]),
                }
              );
        }
    }
});

bot.launch();



