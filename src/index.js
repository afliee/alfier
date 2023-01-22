require('dotenv').config();

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const TOKEN = process.env.DJS_TOKEN;

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: ['MESSAGE'],
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.cooldown = new Collection();
client.emotes = config.emoji;

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()],
});

const functionPath = path.join(__dirname, 'functions');

fs.readdirSync(functionPath).forEach((dir) => {
    const handlerFiles = fs
        .readdirSync(`${functionPath}/${dir}`)
        .filter((file) => file.endsWith('.js'));
    for (const file of handlerFiles) {
        require(`${functionPath}/${dir}/${file}`)(client);
    }
});
client.login(TOKEN);
