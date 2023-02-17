require('dotenv').config();
const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ActionRow,
    ButtonStyle,
} = require('discord.js');

const UID = process.env.UID;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_text_channel')
        .setDescription('Delete the text channel')
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to delete')
                .setRequired(true)
        ),
    async execute(interaction) {
        const { member, guild, user, option, client } = interaction;
        const button = new ButtonBuilder();
        const row = new ActionRow();
        const channel = option.getChannel('channel');
        if (
            user.id !== UID ||
            !member.permissions.has(PermissionFlagsBits.ADMINISTRATOR)
        ) {
            return interaction.reply({
                content: 'You do not have permission to use this command.',
                ephemeral: true,
            });
        }

        button
            .setLabel('Delete')
            .setCustomId('btn_delete')
            .setStyle(ButtonStyle.DANGER);
        row.addComponent(button);
        await interaction.deferReply().catch(() => null);
        let message = await interaction.editReply({
            content: `${interaction.user}, Are you sure you want to delete ${channel}?`,
            components: [btn],
        });
        let collector = message.createMessageComponentCollector();
        setTimeout(() => {
            interaction.deleteReply().catch(() => null);
            collector.stop();
        }, 20 * 1000);

        collector.on('collect', async (i) => {
            if (interaction.user.id != i.user.id)
                return i.deferUpdate().catch(() => null);

            if (i.customId == 'btn_delete') {
                try {
                    await channel.delete();
                    return i.update({
                        content: `Deleted ${channel}`,
                        components: [],
                    });
                } catch (e) {
                    console.log(e);
                    return i.update({
                        content: `Failed to delete ${channel}`,
                        components: [],
                    });
                }
            }
        });
    },
};
