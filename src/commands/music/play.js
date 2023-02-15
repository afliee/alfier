const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const yts = require('yt-search');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play song')
        .addStringOption((option) =>
            option
                .setName('query')
                .setDescription('Give me name or url to play')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { options, member, guild, channel, client, user } = interaction;
        const query = options.getString('query');
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
        console.log(
            member.voice.channelId,
            guild.members.me.voice.channelId,
            !(
                member.voice.channelId ===
                (guild.members.me.voice.channelId
                    ? guild.members.me.voice.channelId
                    : true)
            )
        );
        const memberChannelId = member.voice.channelId;
        const botChannelId = guild.members.me.voice.channelId;

        if (!botChannelId) {
            client.authorQueue = user.id;
            console.log('Not in voice channel');
            try {
                client.distube.play(voiceChannel, query, {
                    textChannel: channel,
                    member: member,
                });

                return interaction.reply({
                    content: '🎧| song received!!',
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
        } else if (memberChannelId !== botChannelId) {
            console.log('Not in same voice channel');
            embed
                .setColor('Red')
                .setDescription(
                    `You can't use because I already active in <#${guild.members.me.voice.channelId}>`
                );
            return interaction.reply({
                embeds: [embed],
            });
        } else {
            console.log('In same voice channel');
            try {
                client.distube.play(voiceChannel, query, {
                    textChannel: channel,
                    member: member,
                });

                return interaction.reply({
                    content: '🎧| song received!!',
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
        }
    },
};
