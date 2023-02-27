const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Select a member and kick them.')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('The member to kick')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('reason').setDescription('The reason for kicking')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const target = interaction.options.getMember('target');
        const reason =
            interaction.options.getString('reason') ?? 'No reason provided';

        console.log(
            target.roles.highest.position,
            interaction.member.roles.highest.position
        );

        if (target.id === interaction.user.id)
            return interaction.reply({
                content: `Your don't have permission to kick yourself`,
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

        if (!target.kickable)
            return interaction.reply({
                content: `Your role have to be unkick ${target.user.username}`,
                ephemeral: true,
            });

        await interaction.reply({
            content: `Kicking ${target.user.username} for reason: ${reason}`,
        });
        await interaction.guild.members
            .kick(target)
            .then(() => console.log(`${target.user.username} kicked`));
    },
};
