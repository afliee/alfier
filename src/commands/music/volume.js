const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Adjust volume a song')
        .addIntegerOption((option) =>
            option
                .setName('percent')
                .setDescription('Give me percent of volume [1-100]%')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild, channel, client } = interaction;
        const embed = new EmbedBuilder();
        const voiceChannel = member.voice.channel;
        const volume = options.getInteger('percent');

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
            client.distube.setVolume(voiceChannel, volume);
            return interaction.reply({
                content: `${
                    volume > 50 ? '🔊' : '🔉'
                }| Volume has been set to ${volume}%!!`,
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
