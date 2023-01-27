const { EmbedBuilder } = require('discord.js');
const status = (queue) => {
    return `Volume: \`${queue.volume}%\` | Filter: \`${
        queue.filters.names.join(', ') || 'Off'
    }\` | Loop: \`${
        queue.repeatMode
            ? queue.repeatMode === 2
                ? 'All Queue'
                : 'This Song'
            : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;
};
module.exports = {
    name: 'distubeEvent',
    async execute(client) {
        try {
            client.distube
                .on('playSong', (queue, song) => {
                    console.log(`play song`);
                    const embed = new EmbedBuilder();
                    embed
                        .setColor('DarkBlue')
                        .setTitle(`${song.name}`)
                        .setURL(`${song.url}`)
                        .setAuthor({
                            name: `${song?.uploader.name}`,
                            url: `${song?.uploader.url}`,
                        })
                        .setDescription(`${client.emotes.play} | ${song.name}`)
                        .addFields(
                            {
                                name: '**View**',
                                value: `${song.views}`,
                                inline: true,
                            },
                            {
                                name: '**Like:**',
                                value: `${song.likes}`,
                                inline: true,
                            },
                            {
                                name: '**Duration:**',
                                value: `${song.formattedDuration}` || 'N:N',
                                inline: true,
                            }
                        )
                        .addFields({
                            name: '**Status**',
                            value: status(queue),
                        })
                        .setImage(song.thumbnail)
                        .setFooter({
                            text: `Requested by ${song.user?.username}`,
                            iconURL: song.user?.displayAvatarURL(),
                        })
                        .setTimestamp();
                    return queue.textChannel.send({
                        embeds: [embed],
                    });
                })
                .on('addSong', (queue, song) => {
                    console.log('add Song');
                    const embed = new EmbedBuilder();
                    embed.setDescription(
                        `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
                    );
                    return queue.textChannel.send({
                        embeds: [embed],
                    });
                })
                .on('addList', (queue, playlist) => {
                    console.log('addList');
                    const embed = new EmbedBuilder();

                    embed
                        .setTitle(`${client.emotes.success}`)
                        .setDescription(
                            `${client.emotes.success} | Added \`${
                                playlist.name
                            }\` playlist (${
                                playlist.songs.length
                            } songs) to queue\n${status(queue)}`
                        );
                    return queue.textChannel.send({
                        embeds: [embed],
                    });
                })
                .on('error', (channel, e) => {
                    if (channel)
                        channel.send(
                            `${client.emotes.error} | An error encountered: ${e
                                .toString()
                                .slice(0, 1974)}`
                        );
                    else console.error(e);
                })
                .on('empty', (queue) =>
                    queue.textChannel?.send(
                        'The voice channel is empty! Leaving the voice channel...'
                    )
                )
                .on('searchNoResult', (message, query) =>
                    message.channel.send(
                        `${client.emotes.error} | No result found for \`${query}\`!`
                    )
                )
                .on('finish', (queue) => queue.textChannel.send('Finished!'))
                .on('searchResult', (message, result) => {
                    let i = 0;
                    message.channel.send(
                        `**Choose an option from below**\n${result
                            .map(
                                (song) =>
                                    `**${++i}**. ${song.name} - \`${
                                        song.formattedDuration
                                    }\``
                            )
                            .join(
                                '\n'
                            )}\n*Enter anything else or wait 60 seconds to cancel*`
                    );
                })
                .on('searchCancel', (message) =>
                    message.channel.send(
                        `${client.emotes.error} | Searching canceled`
                    )
                )
                .on('searchInvalidAnswer', (message) =>
                    message.channel.send(
                        `${client.emotes.error} | Invalid answer! You have to enter the number in the range of the results`
                    )
                )
                .on('searchDone', () => {});
            // DisTubeOptions.searchSongs = true
        } catch (err) {
            console.log(err);
        }
    },
};
