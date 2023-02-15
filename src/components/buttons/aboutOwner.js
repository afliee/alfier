module.exports = {
    data: {
        name: 'about_owner',
        description: "Displays the owner Alfier's Bot",
    },
    async execute(interaction) {
        await interaction.reply({
            content: `https://www.facebook.com/kunzz.3108/`,
        })
    },
}