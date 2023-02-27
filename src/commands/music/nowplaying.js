const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music_playing')
        .setDescription('Get a song playing'),
    async execute(interaction) {
        const { options, member, channel, client, guild } = interaction;

        const voiceChannel = member.voice.channel;
        const embed = new EmbedBuilder();
        if (!voiceChannel) {
            embed
                .setColor('Red')
                .setDescription('Please must be in voice channel');
            return interaction.reply({
                embeds: [embed],
            });
        }

        // if (!(member.voice.channelId === guild.members.me.voice.channelId)) {
        //     embed
        //         .setColor('Red')
        //         .setDescription(
        //             `You can't use because I already active in <#${guild.members.me.voice.channelId}>`
        //         );
        //     return interaction.reply({
        //         embeds: [embed],
        //     });
        // }

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

            const song = queue.songs[0];
            embed
                .setColor('Green')
                .setDescription(
                    `${client.emotes.play} | I'm playing **\`${song.name}\`**, by ${song.user}`
                );
            return interaction.reply({
                embeds: [embed],
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
