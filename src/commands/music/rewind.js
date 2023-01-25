const ms = require('ms');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music_rewind')
        .setDescription('rewind seconds in a song specified')
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('Time to forward')
                .setMinLength(1)
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild, channel, client } = interaction;
        const embed = new EmbedBuilder();
        const voiceChannel = member.voice.channel;
        const time = options.getString('time');

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
            let timeFormatted = ms(time);
            if (timeFormatted && queue.duration - timeFormatted / 1000 > 0) {
                await queue.seek(queue.currentTime - timeFormatted / 1000);
                embed
                    .setColor('Green')
                    .setDescription(`⏮️ | Rewind the song for ${time}`);
                return interaction.reply({
                    embeds: [embed],
                });
            } else throw new Error('Invalid time');
        } catch (e) {
            console.log(e);
            embed.setDescription(`⛔ | Something went wrong`);
            await interaction.reply({
                content: `Time should be formatted as \`1 days, 1d, 1h, 1m, 1s\``,
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
