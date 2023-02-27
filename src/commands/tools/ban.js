const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Select a member and ban them.')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('The member to ban')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for banning')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason =
            interaction.options.getString('reason') ?? 'No reason provided';
        if (target.id === interaction.user.id)
            return interaction.reply({
                content: `Your don't have permission to ban yourself`,
                ephemeral: true,
            });
        if (
            target.roles.highest.position >=
            interaction.member.roles.highest.position
        )
            return interaction.reply({
                content: `Your role have to be highest them`,
                ephemeral: true,
            });

        if (!target.bannable)
            return interaction.reply({
                content: `Your role have to be unbanned ${target.user.username}`,
                ephemeral: true,
            });

        await interaction.reply({
            content: `Banning ${target.user.username} for reason: ${reason}`,
            ephemeral: true,
        });
        await interaction.guild.members.ban(target);
    },
};
