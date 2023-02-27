const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music_skipto')
        .setDescription('Skip to song specified in queue')
        .addIntegerOption((option) =>
            option
                .setName('position')
                .setDescription('specify the position of the song')
                .setMinValue(0)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { client, options, member, channel, guild } = interaction;
        const voiceChannel = member.voice.channel;
        const position = options.getInteger('position');
        const embed = new EmbedBuilder();

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
            const queue = await client.distube.getQueue(voiceChannel);
            if (!queue) {
                embed
                    .setColor('Red')
                    .setDescription('There is no active queue');
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }
            const song = await client.distube.jump(guild, position - 1);
            embed
                .setColor('Green')
                .setDescription(
                    `${client.emotes.success} | Skipped to ${song.name}`
                );
            return interaction.reply({
                embeds: [embed],
            });
        } catch (e) {
            console.log(e);
            embed.setDescription(`${'⛔'} | Something went wrong`);
            await interaction.reply({
                content: `Position out of range`,
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
