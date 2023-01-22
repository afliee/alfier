require('dotenv').config();

const { ActivityType, Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute: async (client) => {
        console.log(`${client.user.username} Ready! on events 🎇✨🎉`);
        const slashCommands = client.commands.map((x) => {
            // return {
            //     name: x.data.name,
            //     description: x.data.description,
            //     options: x.data.options,
            //     execute: x.execute,
            // };
            return x.data.toJSON();
        });
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
