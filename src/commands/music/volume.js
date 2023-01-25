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

        if (!member.voice.channelId === guild.members.me.voice.channelId) {
            embed
                .setColor('Red')
                .setDescription(
                    `You can't use because I already active in <#${guild.members.me.voice.channelId}>`
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
