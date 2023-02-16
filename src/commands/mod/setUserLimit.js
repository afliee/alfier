const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_user_limit')
        .setDescription('Set the user limit of the voice channel')
        .addIntegerOption((option) =>
            option
                .setName('limit')
                .setDescription('The limit of the channel')
                .setMinValue(1)
                .setMaxValue(99)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { user, member, client, guild, options } = interaction;
        const limit = options.getInteger('limit');

        if (!client.colChannels.has(member.voice.channelId)) {
            return interaction.reply({
                content: 'You must be in a channel created by the bot',
                ephemeral: true,
            });
        }
        const { voiceChannel, userId } = client.colChannels.get(
            member.voice.channelId
        );
        if (userId !== user.id) {
            return interaction.reply({
                content: 'You must be the owner of the channel',
                ephemeral: true,
            });
        }
        try {
            await voiceChannel.setUserLimit(limit);
            return interaction.reply({
                content: `🐞 | Successfull to set limit user to **${limit}**`,
            });
        } catch (e) {
            console.log(e);
            return interaction.reply({
                content: `🐞 | An error occured`,
                ephemeral: true,
            });
        }
    },
};
