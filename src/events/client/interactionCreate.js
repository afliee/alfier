const ms = require('ms');
const { InteractionType, Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    execute: async (interaction) => {
        if (interaction.isChatInputCommand()) {
            console.log(
                `${interaction.commandName} was executed by ${interaction.user.tag} in ${interaction.guild.name} and ${interaction.channel.name} channel`
            );
            const command = interaction.client.commands.get(
                interaction.commandName
            );

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            const cooldownData = `${interaction.user.id}/${interaction.commandName}`;
            if (interaction.client.cooldown.has(cooldownData)) {
                const time = ms(
                    interaction.client.cooldown.get(cooldownData) - Date.now()
                );

                return interaction.reply({
                    content: `⌚ | Please, wait ${time} for the cooldown!!`,
                    ephemeral: true,
                });
            }

            interaction.setCooldown = (time) => {
                interaction.client.cooldown.set(
                    cooldownData,
                    Date.now() + time
                );
                setTimeout(
                    () => interaction.client.cooldown.delete(cooldownData),
                    time
                );
            };

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
                await interaction.reply({
                    content: `Some Thing Went Wrong!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.isButton()) {
            const button = interaction.client.buttons.get(interaction.customId);

            if (!button) return new Error('Invalid button');
            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
                await interaction.reply({
                    content: `Some Thing Went Wrong!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.type === InteractionType.ModalSubmit) {
            const modal = interaction.client.modals.get(interaction.customId);
            console.log(modal);
            if (!modal) return new Error('Invalid modal');

            try {
                await modal.execute(interaction);
            } catch (err) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        }
    },
};
