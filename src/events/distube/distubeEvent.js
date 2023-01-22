const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'distubeEvent',
    async execute(client) {
        const embed = new EmbedBuilder();
        const status = (queue) =>
            `Volume: \`${queue.volume}%\` | Filter: \`${
                queue.filters.names.join(', ') || 'Off'
            }\` | Loop: \`${
                queue.repeatMode
                    ? queue.repeatMode === 2
                        ? 'All Queue'
                        : 'This Song'
                    : 'Off'
            }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``;

        client.distube
            .on('playSong', (queue, song) => {
                embed
                    .setColor('DarkBlue')
                    .setTitle(`${client.emotes.play}`)
                    .setDescription(
                        `${client.emotes.play} | Playing \`${song.name}\` - \`${
                            song.formattedDuration
                        }\`\nRequested by: ${song.user}\n${status(queue)}`
                    );
                return queue.textChannel.send({
                    embeds: [embed],
                });
            })
            .on('addSong', (queue, song) => {
                embed
                    .setTitle(`${client.emotes.success}`)
                    .setDescription(
                        `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
                    );
                return queue.textChannel.send({
                    embeds: [embed],
                });
            })
            .on('addList', (queue, playlist) => {
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
            .on('empty', (channel) =>
                channel.send('Voice channel is empty! Leaving the channel...')
            )
            .on('searchNoResult', (message, query) =>
                message.channel.send(
                    `${client.emotes.error} | No result found for \`${query}\`!`
                )
            )
            .on('finish', (queue) => queue.textChannel.send('Finished!'));
        // DisTubeOptions.searchSongs = true
    },
};
