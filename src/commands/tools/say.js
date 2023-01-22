const {SlashCommandBuilder, ChannelType} = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Replies with your input!')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The input to echo back')
                // Ensure the text will fit in an embed description, if the user chooses that option
                .setMaxLength(2000)
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to echo into')
                // Ensure the user can only select a TextChannel for output
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option
                .setName('embed')
                .setDescription('Whether or not the echo should be embedded')
                .setRequired(true)
        ),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        const chanelTarget = interaction.options.getChannel('channel');
        const isEphemeral = interaction.options.getBoolean('embed');

        await chanelTarget.send({
            content: input,
            ephemeral: isEphemeral,
        });
        await interaction.reply({
            content: `Message **'${input}'** sent to ${chanelTarget.name} channel`,
            ephemeral: true,
        });
        // await wait(0);
        await interaction.deleteReply();
    },
};
