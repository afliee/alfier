const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require('discord.js');
const { joinVoiceChannel, getVoiceConnections } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('join')
        .setDescription('Join a channel')
        .addChannelOption((option) =>
            option
                .setName('chanel')
                .setDescription('Channel to join')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        ),
    async execute(interaction) {
        const chanelTarget = interaction.options.getChannel('chanel');
        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Hello eveyone!')
            .setDescription('Can I help you with commands');
        joinVoiceChannel({
            channelId: chanelTarget.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        await interaction.reply({
            content: 'Hí 😁',
            embeds: [embed],
        });
    },
};
