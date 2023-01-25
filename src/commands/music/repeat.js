const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('repeat')
        .setDescription('Loop song or playlist')
        .addStringOption((option) =>
            option
                .setName('options')
                .setDescription('Select mode to repeat')
                .setChoices(
                    { name: 'off', value: 'off' },
                    { name: 'song', value: 'song' },
                    { name: 'queue', value: 'queue' }
                )
        ),
    async execute(interaction) {
        const { options, member, guild, channel, client } = interaction;
        const embed = new EmbedBuilder();
        const voiceChannel = member.voice.channel;
        const option = options.getString('options');
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
            let mode = null;

            switch (option) {
                case 'off':
                    mode = 0;
                    break;
                case 'song':
                    mode = 1;
                    break;
                case 'queue':
                    mode = 2;
                    break;
            }
            mode = queue.setRepeatMode(mode);
            mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off';

            embed
                .setColor('Purple')
                .setDescription(
                    `${client.emotes.repeat} | Set repeat mode to \`${mode}\``
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
