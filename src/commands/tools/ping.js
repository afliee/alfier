const { SlashCommandBuilder } = require('discord.js');

const kao = require('kao.moji');
const kaomojis = [
    ...kao.moji.cat({ all: true }),
    ...kao.moji.angry({ all: true }),
    ...kao.moji.beg({ all: true }),
    ...kao.moji.blush({ all: true }),
    ...kao.moji.hello({ all: true }),
];
module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Generater a kaomoji'),
    async execute(interaction) {
        await interaction.reply({
            content: `${kaomojis[Math.floor(Math.random() * kaomojis.length)]}`,
        });
        interaction.setCooldown(4000);
    },
};
