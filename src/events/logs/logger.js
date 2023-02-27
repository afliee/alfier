require('dotenv').config();
const { Events, EmbedBuilder } = require('discord.js');

const CHANNEL_LOG_ID = process.env.CHANNEL_LOG_ID;

module.exports = {
    name: Events.MessageDelete,
    async execute(message) {
        if (!message.partial) {
            const channel = message.client.channels.cache.get(CHANNEL_LOG_ID);
            const embed = new EmbedBuilder()
                .setTitle('Deleted Message')
                .addFields(
                    {
                        name: 'Author',
                        value: `${message.author.tag} (${message.author.id})`,
                        inline: true,
                    },
                    {
                        name: 'Channel',
                        value: `${message.channel.name} (${message.channel.id})`,
                        inline: true,
                    }
                )
                .setDescription(message.content)
                .setTimestamp();
            channel.send({ embeds: [embed] });
        }
    },
};
