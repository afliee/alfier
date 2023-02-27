const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_text_channel_name')
        .setDescription('Set the name of the text channel')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('The name of the channel')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { user, member, client, guild, options } = interaction;
        const name = options.getString('name');

        await interaction?.deferReply().catch(() => {});

        if (!client.colChannels.has(member.voice.channelId)) {
            await interaction.editReply({
                content: 'You must be in a channel created by the bot',
                ephemeral: true,
            });
        }

        const { voiceChannel, textChannel, userId } = client.colChannels.get(
            member.voice.channelId
        );
        if (userId !== user.id) {
            await interaction.editReply({
                content: 'You must be the owner of the channel',
                ephemeral: true,
            });
        }
        try {
            await textChannel.setName(name);
            await interaction.editReply({
                content: `🐞 | The name of the channel has been changed to **${name}**`,
            });
        } catch (e) {
            console.log(e);
            await interaction.editReply({
                content:
                    "🐞 | I don't have permission to change the name of the channel",
                ephemeral: true,
            });
        }
    },
};
