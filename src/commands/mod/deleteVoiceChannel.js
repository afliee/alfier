<<<<<<< HEAD
require('dotenv').config();
const {
    SlashCommandBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

const UID = process.env.UID;

const getAllTextChannel = (client, guildId) => {
    const { autoCreateCategory } = client.guildSettings.get(guildId);
    const channels = client.channels.cache
        .filter((channel) => {
            return (
                channel.type === ChannelType.GuildVoice &&
                channel.parentId === autoCreateCategory.id
            );
        })
        .map((channel) => {
            return {
                label: channel.name,
                value: channel.id,
            };
        });
    return channels;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_voice_channel')
        .setDescription('Delete the voice channel'),
    async execute(interaction) {
        const { member, guild, user, option, client } = interaction;
        const select = new StringSelectMenuBuilder();
        const row = new ActionRowBuilder();
        await interaction?.deferReply().catch(() => {});
        try {
            if (
                user.id !== UID ||
                !member.permissions.has(PermissionFlagsBits.Administrator)
            ) {
                await interaction.editReply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true,
                });
            }
            const categoryId = client.guildSettings.get(
                guild.id
            )?.autoCreateCategory;
            if (!categoryId) {
                await interaction.editReply({
                    content: 'You must be set auto create channel first.',
                    ephemeral: true,
                });
            }

            const channels = getAllTextChannel(client, guild.id);
            console.log(channels);
            if (channels.length === 0) {
                await interaction.editReply({
                    content: 'No text channel found.',
                    ephemeral: true,
                });
            } else {
                select
                    .setCustomId('select_text_channel')
                    .setPlaceholder('Select a text channel')
                    .addOptions(...channels);
                row.addComponents(select);
            }
            let message = await interaction.editReply({
                content: `${interaction.user}, Are you sure you want to delete?\n**Note:** This action cannot be undone.`,
                components: [row],
            });
            let collector = message.createMessageComponentCollector();
            setTimeout(() => {
                collector.stop();
            }, 20 * 1000);
            collector.on('collect', async (i) => {
                if (i.customId === 'select_text_channel') {
                    const channel = client.channels.cache.get(i.values[0]);

                    await channel.delete();
                    await i.update({
                        content: `🦄 | Deleted ${channel}`,
                    });
                    message.delete();
                }
            });
        } catch (e) {
            console.log(e);
            await interaction.editReply({
                content: `🦄 | An error occurred`,
                ephemeral: true,
            });
        }
    },
};
=======
require('dotenv').config();
const {
    SlashCommandBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require('discord.js');

const UID = process.env.UID;

const getAllTextChannel = (client, guildId) => {
    const { autoCreateCategory } = client.guildSettings.get(guildId);
    const channels = client.channels.cache
        .filter((channel) => {
            return (
                channel.type === ChannelType.GuildVoice &&
                channel.parentId === autoCreateCategory.id
            );
        })
        .map((channel) => {
            return {
                label: channel.name,
                value: channel.id,
            };
        });
    return channels;
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete_voice_channel')
        .setDescription('Delete the voice channel'),
    async execute(interaction) {
        const { member, guild, user, option, client } = interaction;
        const select = new StringSelectMenuBuilder();
        const row = new ActionRowBuilder();
        await interaction?.deferReply().catch(() => {});
        try {
            if (
                user.id !== UID ||
                !member.permissions.has(PermissionFlagsBits.Administrator)
            ) {
                await interaction.editReply({
                    content: 'You do not have permission to use this command.',
                    ephemeral: true,
                });
            }
            const categoryId = client.guildSettings.get(
                guild.id
            )?.autoCreateCategory;
            if (!categoryId) {
                await interaction.editReply({
                    content: 'You must be set auto create channel first.',
                    ephemeral: true,
                });
            }

            const channels = getAllTextChannel(client, guild.id);
            console.log(channels);
            if (channels.length === 0) {
                await interaction.editReply({
                    content: 'No text channel found.',
                    ephemeral: true,
                });
            } else {
                select
                    .setCustomId('select_text_channel')
                    .setPlaceholder('Select a text channel')
                    .addOptions(...channels);
                row.addComponents(select);
            }
            let message = await interaction.editReply({
                content: `${interaction.user}, Are you sure you want to delete?\n**Note:** This action cannot be undone.`,
                components: [row],
            });
            let collector = message.createMessageComponentCollector();
            setTimeout(() => {
                collector.stop();
            }, 20 * 1000);
            collector.on('collect', async (i) => {
                if (i.customId === 'select_text_channel') {
                    const channel = client.channels.cache.get(i.values[0]);

                    await channel.delete();
                    await i.update({
                        content: `🦄 | Deleted ${channel}`,
                    });
                    message.delete();
                }
            });
        } catch (e) {
            console.log(e);
            await interaction.editReply({
                content: `🦄 | An error occurred`,
                ephemeral: true,
            });
        }
    },
};
>>>>>>> c2a0122ba1f0e6fa41c751a358a61e5ba7079d67
