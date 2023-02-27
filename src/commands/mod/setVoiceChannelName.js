const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_voice_channel_name')
        .setDescription('Set the name of the voice channel')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('The name of the channel')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { user, member, client, guild, options } = interaction;
        const name = options.getString('name');

        if (!client.colChannels.has(member.voice.channelId)) {
            return interaction.reply({
                content: 'You must be in a channel created by the bot',
                ephemeral: true,
            });
        }
        const { voiceChannel, textChannel, userId } = client.colChannels.get(
            member.voice.channelId
        );
        if (userId !== user.id) {
            return interaction.reply({
                content: 'You must be the owner of the channel',
                ephemeral: true,
            });
        }
        try {
            await voiceChannel.setName(name);
            return interaction.reply({
                content: `🐞 | The name of the channel has been changed to **${name}**`,
            });
        } catch (e) {
            console.log(e);
            return interaction.reply({
                content: '🦄 | An error occured',
                ephemeral: true,
            });
        }
    },
};
