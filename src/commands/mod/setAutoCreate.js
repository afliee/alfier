const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set_autocreate')
        .setDescription('Set the auto create channel settings for this server.')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to use for auto create.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice)
        )
        .addChannelOption((option) =>
            option
                .setName('category_id')
                .setDescription('The category ID to use for auto create.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildCategory)
        ),
    async execute(interaction) {
        const { client, options, member, guild } = interaction;

        if (member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)) {
            const channel = options.getChannel('channel');
            const category = options.getChannel('category_id');
            const guildId = guild.id;
            const channelId = channel.id;
            const guildSettings = client.guildSettings.get(guildId);
            guildSettings.autoCreateChannel = channelId;
            guildSettings.autoCreateCategory = category;

            client.guildSettings.set(guildId, guildSettings);
            const embed = new EmbedBuilder()
                .setTitle('Auto Create Channel Set')
                .setDescription(
                    `The auto create channel has been set to ${channel}.`
                )
                .setColor(0x00ff00);
            interaction.reply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setTitle('Permission Denied')
                .setDescription(
                    'You do not have permission to use this command.'
                )
                .setColor(0xff0000);
            interaction.reply({ embeds: [embed] });
        }
    },
};
