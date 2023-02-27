const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription('Leave a channel'),
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
                client.distube.voices.leave(voiceChannel);
                return interaction.reply({
                    content: `(～￣▽￣)～ | Bye bye!`,
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
