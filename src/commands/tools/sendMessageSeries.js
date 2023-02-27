const {
    SlashCommandBuilder,
    MessageCollector,
    EmbedBuilder,
    PermissionFlagsBits,
} = require('discord.js');
const user = require('../user/user');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('send_message_series')
        .setDescription('Send a series of messages to users')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('Content will be sent to users')
                // Ensure the text will fit in an embed description, if the user chooses that option
                .setMaxLength(2000)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const author = interaction.user;
        const input = interaction.options.getString('input');
        const filter = (newMessage) => {
            return newMessage.author.id === interaction.user.id;
        };
        // await interaction.deferReply({ ephemeral: true });
        // await interaction.guild.members
        //     .fetch({ withPresences: true })
        //     .then(async (fetchedMembers) => {
        //         const users = fetchedMembers
        //             .filter((member) => !member.user.bot)
        //             .map((member) => member.user)
        //             .forEach(async (member) => {
        //                 const embed = new EmbedBuilder()
        //                     .setTitle(`Hí, Chào ${member.username}`)
        //                     .setDescription(input)
        //                     .setAuthor({
        //                         name: member.username,
        //                         iconURL: member.avatarURL(),
        //                         url: member.bannerURL(),
        //                     })
        //                     .setColor(0x0099ff)
        //                     .setThumbnail(member.avatarURL())
        //                     .setFooter({
        //                         text: `Happy New Year! ${member.username} || Owner: ${interaction.user.username}`,
        //                         iconURL: member.avatarURL(),
        //                     });

        //                 try {
        //                     await member.send({
        //                         embeds: [embed],
        //                     });
        //                 } catch (e) {
        //                     console.log(e) ;
        //                 }
        //                 console.log(`Sent to ${member.username}`);
        //             });
        //     });
        // await interaction.editReply({
        //     content: 'Done',
        //     ephemeral: true,
        // });
        await interaction.reply({
            content: `<@${author.id}>, Give me list users you want to receive!!!`,
            ephemeral: true,
            // fetchReply: true,
        });

        const collector = new MessageCollector(interaction.channel, filter, {
            max: 1,
            time: 1000 * 60,
            errors: ['time'],
        });
        collector.on('collect', async (collected) => {
            const users = collected.mentions.users.filter((user) => !user.bot);
            users.forEach(async (user) => {
                user = await interaction.client.users.fetch(user.id);

                const embed = new EmbedBuilder()
                    .setTitle(`Hí, Chào ${user.username}`)
                    .setDescription(input)
                    .setAuthor({
                        name: user.username,
                        iconURL: user.avatarURL(),
                        url: user.bannerURL(),
                    })
                    .setColor(0x0099ff)
                    .setThumbnail(user.avatarURL())
                    .setFooter({
                        text: `Happy New Year! ${user.username} || Owner: ${interaction.user.username}`,
                        iconURL: user.avatarURL(),
                    });

                try {
                    await user.send({
                        embeds: [embed],
                    });
                } catch (e) {
                    console.log(e);
                }
                console.log(`Sent to ${user.username}`);
            });
        });
        await interaction.reply({
            content: `Done`,
            ephemeral: true,
        });
    },
};
