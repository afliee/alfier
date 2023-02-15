const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Previous a song'),
    async execute(interaction) {
        const { options, member, guild, channel, client } = interaction;
        const embed = new EmbedBuilder();
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            embed
                .setColor('Red')
                .setDescription('Please must be in voice channel');
            return interaction.reply({
                embeds: [embed],
            });
        }

        const memberChannelId = member.voice.channelId;
        const botChannelId = guild.members.me.voice.channelId;
        if (!botChannelId || memberChannelId !== botChannelId) {
            embed
                .setColor('Red')
                .setDescription(
                    'You must be in same voice channel with bot to use this command'
                );
            return interaction.reply({
                embeds: [embed],
            });
        }

        try {
            const song = client.distube.previous();
            return interaction.reply({
                content: `${client.emotes.success} | Now playing:\n${song.name}`,
            });
        } catch (e) {
            console.log(e);
            embed.setDescription(
                `${client.emotes.error} | Something went wrong`
            );
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
