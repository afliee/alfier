const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    SlashCommandBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('modal')
        .setDescription('this is a test command'),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('account_modal')
            .setTitle('Enter Your Student Account');
        const mssv = new TextInputBuilder()
            .setCustomId('mssv')
            // The label is the prompt the user sees for this input
            .setLabel('Your Student Id?')
            // Short means only a single line of text
            .setStyle(TextInputStyle.Short);

        const pass = new TextInputBuilder()
            .setCustomId('pass')
            .setLabel('Your password?')
            // Paragraph means multiple lines of text.
            .setStyle(TextInputStyle.Short);

        const name = new TextInputBuilder()
            .setCustomId('name')
            .setLabel('Your name?')
            .setStyle(TextInputStyle.Paragraph);

        // An action row only holds one text input,
        // so you need one action row per text input.
        const firstActionRow = new ActionRowBuilder().addComponents(mssv);
        const secondActionRow = new ActionRowBuilder().addComponents(pass);
        const thirtActionRow = new ActionRowBuilder().addComponents(name);
        // Add inputs to the modal
        modal.addComponents(firstActionRow, secondActionRow, thirtActionRow);

        // Show the modal to the user
        await interaction.showModal(modal);
    },
};
