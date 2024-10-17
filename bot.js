// import library
const { Agent } = require("node:https");
const { Telegraf, Markup  } = require("telegraf");
const { message } = require("telegraf/filters");
require('dotenv').config()

// init bot 
const token = process.env.BOT;
const bot = new Telegraf(token);
const host = "https://1f3b-2a09-bac5-d46d-16dc-00-247-fb.ngrok-free.app";

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

// https://1f3b-2a09-bac5-d46d-16dc-00-247-fb.ngrok-free.app/algolink?ORX7PDVSFMJ3RQLW5LWDQI66ZJAN3FAYYEBZYDKDCEQU33IPS3RKCNO64A
// https://1f3b-2a09-bac5-d46d-16dc-00-247-fb.ngrok-free.app/algolink?DTUA424DKCJYPHF5MLO6CL4R2BWOTH2GLOUQA257K5I7G65ENHSDJ4TTTE

bot.command('create', async (ctx) => {
    ctx.reply('I need your address to create a link to you. Please send me your pera wallet address!');
    await new Promise(resolve => setTimeout(resolve, 300));
    ctx.reply(ctx.message.message_id)
});

bot.on(message("text"), async (ctx) => {
    const messageText = ctx.message.text;
    const urlRegex = /https*:\/\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)\.ngrok-free\.app\/algolink\?\w{58}$/mis;
     

    if (messageText.startsWith("/")) {
        return;
    }

    if (urlRegex.test(messageText)) {
        const parsedUrl = new URL(messageText);
        const urlHost = parsedUrl.hostname;
        console.log(urlHost);
        console.log(new URL(host).hostname);

        if (urlHost==new URL(host).hostname){
            ctx.reply("Your've received an algolink");
            await new Promise(resolve => setTimeout(resolve, 300));
            ctx.reply('Click button to open Algolink and send Algo', Markup.inlineKeyboard([
                [Markup.button.url('Algolink', parsedUrl)]
            ]));
        }
    }
});

bot.launch();



