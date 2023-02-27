const {ModalBuilder, ActionRowModalData} = require("discord.js");

module.exports = {
    data: {
        name: "account_modal",
        description: "Get Student Account"
    },
    async execute(interaction) {
        const submitted = await interaction
            .awaitModalSubmit({
                // Timeout after a minute of not receiving any valid Modals
                time: 60000,
                // Make sure we only accept Modals from the User who sent the original Interaction we're responding to
                filter: (i) => i.user.id === interaction.user.id,
            })
            .catch((error) => {
                // Catch any Errors that are thrown (e.g. if the awaitModalSubmit times out after 60000 ms)
                console.error(error);
                return null;
            });
        if (submitted) {
            const mssv = submitted.fields.getTextInputValue('mssv');
            const pass = submitted.fields.getTextInputValue('pass');
            const name = submitted.fields.getTextInputValue('name');
            await submitted.reply({
                content: `you did submit with content '${mssv}' and '${pass}' and '${name}'`,
                ephemeral: true
            });
        }
    }
}