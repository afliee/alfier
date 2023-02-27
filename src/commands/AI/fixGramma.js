const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fix_gramma')
        .setDescription('Fix your English grammar')
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('The text you want to fix')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { client, user } = interaction;
        const text = interaction.options.getString('text');
        const prompt = `Text: ${text} Corrected:`;

        try {
            await interaction.deferReply();
            const response = await client.openai.createEdit({
                model: 'text-davinci-edit-001',
                input: text,
                instruction: 'Fix the spelling mistakes',
            });
            console.log(response.data.choices[0].text);
            const answer = response.data.choices[0].text;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: user.username,
                    iconURL: user.displayAvatarURL(),
                })
                .addFields({
                    name: '**Original Text**',
                    value: text,
                    inline: false,
                })
                .addFields({
                    name: '**New Text**',
                    value: answer,
                    inline: false,
                })
                .setThumbnail(user.avatarURL())
                .setTitle('AI Response')
                .setTimestamp()
                .setColor('Green');
            await interaction.editReply({
                embeds: [embed],
                ephemeral: false,
            });
        } catch (err) {
            console.log(err);
            const embed = new EmbedBuilder()
                .setDescription('Something went wrong, please try again later')
                .setColor('Red');
            await interaction.editReply({ embeds: [embed] });
        }
    },
};
