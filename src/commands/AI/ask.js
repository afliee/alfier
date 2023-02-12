const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask_ai')
        .setDescription('Ask the AI a question')
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('The question you want to ask the AI')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { client } = interaction;
        const question = interaction.options.getString('question');
        const prompt = `Q: ${question} A:`;

        try {
            await interaction.deferReply();
            const response = await client.openai.createCompletion({
                model: 'text-davinci-003',
                prompt,
                max_tokens: 2500,
                temperature: 0.4,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            console.log(response.data.choices[0].text);
            const answer = response.data.choices[0].text;

            const embed = new EmbedBuilder()
                .setTitle('AI Response')
                .setDescription(answer)
                .setColor('Navy');
            await interaction.editReply({
                embeds: [embed],
                ephemeral: false,
            });
        } catch (err) {
            console.log(err);
            const embed = new EmbedBuilder()
                .setTitle('Error')
                .setDescription('Something went wrong, please try again later')
                .setColor('Red');
            return interaction.editReply({
                embeds: [embed],
            });
        }
    },
};
