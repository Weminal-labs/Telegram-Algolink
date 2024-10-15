// import library
const { Agent } = require("node:https");
const { Telegraf, Markup  } = require("telegraf");
const {PeraWalletConnect} = require("@perawallet/connect");
require('dotenv').config()

// init bot 
const token = process.env.BOT;
const bot = new Telegraf(token);

// init Pera WalletConnect instance
const peraWallet = new PeraWalletConnect({
    chainId: "416002",
    shouldShowSignTxnToast: true
});

let ADDRESS = null;

// bot handlers
bot.start((ctx) => {
    ctx.reply("Hello " + ctx.from.first_name + "!");
    ctx.telegram.sendMessage(ctx.chat.id, "Welcome to the Algolink!");
    
});

bot.command('blink', async (ctx) => {
    // Assume we have a function to get the user's wallet state
    

    if (!!!ADDRESS) {
        ctx.reply('Click button to open Pera Wallet Mobile and connect', Markup.inlineKeyboard([
            [Markup.button.url('Blink Pera Wallet', 'https://7c4a-2a09-bac1-7a80-10-00-17-16c.ngrok-free.app')]
        ]));
        



    } else {
        ctx.reply('Your wallet is connected.\nIf you want to disconnect, please click the button below', Markup.inlineKeyboard([
            [Markup.button.callback('Disconnect', 'disconnect_wallet')]
        ]));
        
    }
});

bot.on('callback_query', (ctx) => {
    const { data } = ctx.callbackQuery;

    if (data === 'disconnect_wallet') {
        // handle disconnect
        peraWallet.disconnect();
  
        setAccountAddress(null);
    }
    
});

bot.launch();



