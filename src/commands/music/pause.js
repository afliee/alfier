const {
    SlashCommandBuilder,
    EmbedBuilder,
    VoiceChannel,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause current song'),
    async execute(interaction) {
        const { member, guild, client } = interaction;
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

        const queue = await client.distube.getQueue(voiceChannel);
        if (!queue) {
            embed.setColor('Red').setDescription('There is no active queue');
            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
        
        try {
            await queue.pause(voiceChannel);
            embed
                .setColor('Green')
                .setDescription(
                    `${client.emotes.stop} | The song has been paused`
                );
            return interaction.reply({
                embeds: [embed],
                ephemeral: true,
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
