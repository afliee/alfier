const { Events, ChannelType, CategoryChannel } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(oldState, newState) {
        console.log('in voice state update');
        let oldChannelId = oldState.channelId;
        let newChannelId = newState.channelId;
        let user = newState.member;
        let guild = newState.guild;
        const client = newState.client;

        const guildSettings = newState.client.guildSettings.get(guild.id);
        const idChanel = guildSettings.autoCreateChannel;
        const categoryChannel = guildSettings.autoCreateCategory;

        if (!oldChannelId && newChannelId) {
            console.log('user joined channel');
            if (newChannelId === idChanel) {
                const channelName = user.user.username;
                const voiceChannel = await createVoiceChannel(
                    guild,
                    channelName,
                    categoryChannel
                );
                const textChannel = await createTextChannel(
                    guild,
                    channelName,
                    categoryChannel
                );
                moveUserToChannel(user, voiceChannel);
                client.colChannels.set(voiceChannel.id, {
                    voiceChannel,
                    textChannel,
                });
            }
        } else if (oldChannelId && !newChannelId) {
            console.log('user left channel');
            if (client.colChannels.has(oldChannelId)) {
                const { voiceChannel, textChannel } =
                    client.colChannels.get(oldChannelId);
                if (voiceChannel.members.size === 0) {
                    await deleteChannel(voiceChannel, 1000);
                    await deleteChannel(textChannel, 1000);
                    client.colChannels.delete(oldChannelId);
                }
            }
        } else if (oldChannelId && newChannelId) {
            console.log('user switched channels');
            if (newChannelId === idChanel) {
                moveUserToChannel(user, oldState.channel);
            } else {
                if (client.colChannels.has(oldChannelId)) {
                    const { voiceChannel, textChannel } =
                        client.colChannels.get(oldChannelId);
                    if (voiceChannel.members.size === 0) {
                        await deleteChannel(voiceChannel, 1000);
                        await deleteChannel(textChannel, 1000);
                        client.colChannels.delete(oldChannelId);
                    }
                }
            }
        }
    },
};

async function createVoiceChannel(guild, name, categoryChannel) {
    return guild.channels.create({
        name: name,
        type: ChannelType.GuildVoice,
        parent: categoryChannel,
    });
}

async function createTextChannel(guild, name, categoryChannel) {
    return guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
        parent: categoryChannel,
    });
}

// move user to anorher voice channel
function moveUserToChannel(user, channel) {
    user.voice.setChannel(channel);
}

function deleteChannel(channel, timeout) {
    return new Promise((resolve) => {
        setTimeout(() => {
            channel.delete();
            resolve();
        }, timeout);
    });
}
