const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('img_variation')
        .setDescription('Get a variation of an image')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to get the image from')
                .setRequired(true)
        ),
    async execute(interaction) {
        // create image variation with avatar url with createImageVariation of openai
    },
};
