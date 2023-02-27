require('dotenv').config();
const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

const UID = process.env.UID;

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
        const { client, options, member, guild, user } = interaction;

        await interaction?.deferReply().catch(() => {});
        try {
            if (
                user.id === UID ||
                member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)
            ) {
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

                await interaction.editReply({ embeds: [embed] }).catch(() => {
                    console.log("Couldn't edit reply. in setAutoCreate");
                });
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setDescription(
                        'You do not have permission to use this command.'
                    )
                    .setColor(0xff0000);
                return await interaction.editReply({ embeds: [embed] });
            }
        } catch (e) {
            console.log(e);
            return await interaction.editReply({
                content: `There was an error setting the auto create channel. Please try again later.`,
                ephermeral: true,
            });
        }
    },
};
