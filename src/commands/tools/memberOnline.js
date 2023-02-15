const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('member_online')
        .setDescription('Get all members online'),
    async execute(interaction) {
        await interaction.guild.members
            .fetch({ withPresences: true })
            .then(async (fetchedMembers) => {
                const totalOnline = fetchedMembers
                    .map((member) => {
                        return !member.user.bot ? member : '';
                    })
                    .filter((member) => {
                        if (member) return member;
                    });
                const embed = new EmbedBuilder()
                    .setColor(0x0099ff)
                    .setTitle('List of members')
                    .setDescription(totalOnline.join(', '));
                await interaction.reply({
                    embeds: [embed],
                });
            });
    },
};
