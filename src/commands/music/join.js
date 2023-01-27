const {
    SlashCommandBuilder,
    EmbedBuilder,
    userMention,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music_join')
        .setDescription('Join a voice channel'),
    async execute(interaction) {
        const { options, member, guild, channel, client, user } = interaction;
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

        if (client.authorQueue === user.id) {
            try {
                client.distube.voices.join(voiceChannel);
                return await interaction.reply({
                    content: `${client.emotes.success} | Now give me song name or url by \`/music \``,
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
        } else {
            embed
                .setColor('Red')
                .setDescription(
                    `${client.emotes.error} | You dont have permission to use this command | Author: <@${client.authorQueue}>`
                );
            return interaction.reply({
                embeds: [embed],
            });
        }
    },
};
