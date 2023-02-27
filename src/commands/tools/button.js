const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about_owner')
        .setDescription('About Owner Alfier Bot'),
    async execute(interaction) {
        const button = new ButtonBuilder()
            .setCustomId('about_owner')
            .setStyle(ButtonStyle.Primary)
            .setLabel('Click me!');
        await interaction.reply({
            components: [new ActionRowBuilder().addComponents(button)],
        });
    },
};
