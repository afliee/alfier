const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
    VoiceChannel,
    GuildEmoji,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Play song')
        .addSubcommand((subcommand) =>
            subcommand
                .setName('play')
                .setDescription('Play a song')
                .addStringOption((option) =>
                    option
                        .setName('query')
                        .setDescription('Give me name or url to play')
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('volume')
                .setDescription('Adjust volume a song')
                .addIntegerOption((option) =>
                    option
                        .setName('percent')
                        .setDescription('Give me percent of volume [1-100]%')
                        .setMinValue(1)
                        .setMaxValue(100)
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName('settings')
                .setDescription('Select options you want')
                .addStringOption((option) =>
                    option
                        .setName('option')
                        .setDescription('Select option')
                        .addChoices(
                            { name: 'queue', value: 'queue' },
                            { name: 'skip', value: 'skip' },
                            { name: 'pause', value: 'pause' },
                            { name: 'resume', value: 'resume' },
                            { name: 'stop', value: 'stop' },
                            { name: 'autoplay', value: 'autoplay' }
                        )
                )
        ),
    async execute(interaction) {
        const { options, member, guild, channel, client } = interaction;

        const subcommand = options.getSubcommand();
        const query = options.getString('query');
        const volume = options.getInteger('percent');
        const option = options.getString('option');
        const voiceChannel = member.voice.channel;

        const embed = new EmbedBuilder();

        if (!voiceChannel) {
            embed
                .setColor('Red')
                .setDescription('Please must be in voice channel');
            return interaction.reply({
                embeds: [embed],
            });
        }

        if (!member.voice.channelId === guild.members.me.voice.channelId) {
            embed
                .setColor('Red')
                .setDescription(
                    `You can't use because I already active in <#${guild.members.me.voice.channelId}>`
                );
            return interaction.reply({
                embeds: [embed],
            });
        }

        try {
            switch (subcommand) {
                case 'play':
                    client.distube.play(voiceChannel, query, {
                        textChannel: channel,
                        member: member,
                    });
                    return interaction.reply({
                        content: '🎧| song received!!',
                    });
                case 'volume':
                    client.distube.setVolume(voiceChannel, volume);
                    return interaction.reply({
                        content: `${
                            volume > 50 ? '🔊' : '🔉'
                        }| Volume has been set to ${volume}%!!`,
                    });
                case 'settings':
                    const queue = await client.distube.getQueue(voiceChannel);

                    if (!queue) {
                        embed
                            .setColor('Red')
                            .setDescription('There is no active queue');
                        return interaction.reply({
                            embeds: [embed],
                            ephemeral: true,
                        });
                    }

                    switch (option) {
                        case 'skip':
                            await queue.skip(voiceChannel);
                            embed
                                .setColor('Green')
                                .setDescription(
                                    '⏭️ | The song has been skiped'
                                );
                            return interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        case 'stop':
                            await queue.stop(voiceChannel);
                            embed
                                .setColor('Green')
                                .setDescription(
                                    '⏹️ | The song has been stopped'
                                );
                            return interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        case 'pause':
                            await queue.pause(voiceChannel);
                            embed
                                .setColor('Green')
                                .setDescription(
                                    '⏯️ | The song has been paused'
                                );
                            return interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        case 'resume':
                            await queue.resume(voiceChannel);
                            embed
                                .setColor('Green')
                                .setDescription(
                                    '⏯️ | The song has been paused'
                                );
                            return interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        case 'queue':
                            embed
                                .setColor('Purple')
                                .setDescription(
                                    `${queue.song.map(
                                        (song, id) =>
                                            `\n**${id + 1}.** ${
                                                song.name
                                            } -\` ${song.formattedDuration} `
                                    )}`
                                );
                            return interaction.reply({
                                embeds: [embed],
                                ephemeral: true,
                            });
                        case 'autoplay':
                            const autoplay = queue.toggleAutoplay();
                            embed
                                .setColor('Blurple')
                                .setDescription(
                                    `${client.emotes.success} | AutoPlay: \`${
                                        autoplay ? 'On' : 'Off'
                                    }\``
                                );
                            return interaction.reply({
                                embeds: [embed],
                            });
                    }
            }
        } catch (err) {
            console.log(err);
        }
    },
};
