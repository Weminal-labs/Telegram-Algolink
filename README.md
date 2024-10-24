# Telegram-Algolink

## Overview
Telegram-Algolink is a project designed to integrate Algolink functionalities with Telegram, allowing users to interact with Algolink services directly through the Telegram bot

## Features

- **Connect with Pera Wallet**: Seamlessly integrate with the Pera Wallet for easy transactions.
- **Create Algolink to Receive Algo**: Generate a link using the bot that can be shared with other users or sent to Telegram groups to receive donations.
- **Send Algo**: Users can quickly send Algo to the creator when they receive Algolinks.

## Installation
To install the project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/Weminal-labs/Telegram-Algolink.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Telegram-Algolink
   ```
3. Install the required dependencies:
   ```bash
   npm install
   ```
4. Start the algolink-connect:
    ```bash
    cd algolink-connect
    npm run dev
    ```
5. Hosting the algolink-connect using ngrok:
    ```bash
    ngrok http domain yourdomain 5173
    ```
6. Copy the ngrok url and paste it in the bot.js file in line 10
7. Open new terminal and start the algolink-BE:
    ```bash
    cd algolink-BE
    npm run dev
    ```
8. Open new terminal and start the bot:
    ```bash
    node bot.js
    ```


