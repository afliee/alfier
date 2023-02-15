require('dotenv').config();

const { ActivityType, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log(`${client.user.username} Ready! on events 🎇✨🎉`);
        const guilds = client.guilds.cache.map((guild) => guild.id);
        const slashCommands = client.commands.map((x) => {
            return x.data.toJSON();
        });
        guilds.forEach((guildId) => client.guildSettings.set(guildId, {}));
        // await client.guilds.cache.get(GUILD_ID).commands.set(slashCommands);
        await client.application.commands.set(slashCommands);

        client.user.setPresence({
            status: 'playing',
            activities: [
                {
                    name: '🍬',
                    type: ActivityType.Competing,
                },
            ],
        });
    },
};
