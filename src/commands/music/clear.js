const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRow,
    ActionRowBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music_clear')
        .setDescription('Clear current queue'),
    async execute(interaction) {
        const { client, member, guild, channel, user } = interaction;
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

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('confirm_btn')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Clear Current State??')
        );

        await interaction.reply({
            components: [row],
        });

        const filter = (i) =>
            i.customId === 'confirm_btn' && i.user.id === user.id;

        try {
            const queue = client.distube.getQueue(voiceChannel);

            if (!queue) {
                embed
                    .setColor('Red')
                    .setDescription('There is no active queue');
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true,
                });
            }

            const collector = channel.createMessageComponentCollector({
                filter,
                time: 1000 * 15,
            });

            collector.on('collect', async (i) => {
                queue.songs = [];
                await i.update({ content: `A button was clicked!` });
            });
        } catch (e) {
            console.log(e);
            await interaction.reply({
                content: `Position out of range`,
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};
