require('dotenv').config();

const fs = require('fs');
const path = require('path');
const config = require('../config.json');

const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const TOKEN = process.env.DJS_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ORGANIZATION_ID = process.env.ORGANIZATION_ID;
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
client.cooldown = new Collection();
client.guildSettings = new Collection();
client.colChannels = new Collection();
client.queue = new Map();
client.commandArray = [];
client.emotes = config.emoji;

client.distube = new DisTube(client, {
    searchSongs: 5,
    leaveOnEmpty: true,
    leaveOnFinish: true,
    leaveOnStop: false,
    emptyCooldown: 30,
    emitNewSongOnly: true,
    emitAddListWhenCreatingQueue: false,
    emitAddSongWhenCreatingQueue: false,
    plugins: [
        new SpotifyPlugin({
            emitEventsAfterFetching: true,
        }),
        new SoundCloudPlugin(),
        new YtDlpPlugin({
            update: true,
        }),
    ],
});
const configuration = new Configuration({
    organization: ORGANIZATION_ID,
    apiKey: OPENAI_API_KEY,
});
client.openai = new OpenAIApi(configuration);

const functionPath = path.join(__dirname, 'functions');

fs.readdirSync(functionPath).forEach((dir) => {
    const handlerFiles = fs
        .readdirSync(`${functionPath}/${dir}`)
        .filter((file) => file.endsWith('.js'));
    // require handler files
    for (const file of handlerFiles) {
        require(`${functionPath}/${dir}/${file}`)(client);
    }
});

client.login(TOKEN);
