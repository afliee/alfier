const { getAudioUrl, getAllAudioUrls } = require('google-tts-api');
const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
} = require('discord.js');
const {
    joinVoiceChannel,
    createAudioResource,
    createAudioPlayer,
    VoiceConnectionStatus,
    entersState,
    AudioPlayerStatus,
    StreamType,
} = require('@discordjs/voice');

async function playAudio({ connection, audioURL, player }, isDestroy) {
    return new Promise(async (resolve, reject) => {
        try {
            const resource = createAudioResource(audioURL, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
            });
            const subscription = await connection.subscribe(player);
            await player.play(resource);

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('is destroyed ' + isDestroy);

                if (isDestroy) {
                    subscription.unsubscribe();
                    connection.destroy();
                    resolve('OK in line 41');
                } else {
                    resolve('OK in line 45');
                }
            });
        } catch (e) {
            console.log(e);
            reject(new Error(e.message));
        }
    });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('speak')
        .setDescription('Text to Speech!')
        .addStringOption((option) =>
            option
                .setName('input')
                .setDescription('The input to tts')
                // Ensure the text will fit in an embed description, if the user chooses that option
                .setMaxLength(2000)
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription('The channel to echo into')
                // Ensure the user can only select a TextChannel for output
                .addChannelTypes(ChannelType.GuildVoice)
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        const input = interaction.options.getString('input');
        const guildID = interaction.guildId;
        const adapterCreator = interaction.guild.voiceAdapterCreator;
        const audioURLs = await getAllAudioUrls(input, {
            lang: 'vi',
            slow: false,
            host: 'https://translate.google.com',
            timeout: 10000,
        });
        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        const player = createAudioPlayer();

        let i = 1;
        console.log(audioURLs);
        await interaction.deferReply({ ephemeral: true });

        for (const audio of audioURLs) {
            console.log(audio.shortText);
            const payload = {
                connection,
                audioURL: audio.url,
                player,
            };
            await playAudio(payload, i === audioURLs.length);
            i++;
        }
        connection.on(
            VoiceConnectionStatus.Disconnected,
            async (oldState, newState) => {
                try {
                    await Promise.race([
                        entersState(
                            connection,
                            VoiceConnectionStatus.Signalling,
                            5_000
                        ),
                        entersState(
                            connection,
                            VoiceConnectionStatus.Connecting,
                            5_000
                        ),
                    ]);
                    // Seems to be reconnecting to a new channel - ignore disconnect
                } catch (error) {
                    // Seems to be a real disconnect which SHOULDN'T be recovered from
                    connection.destroy();
                }
            }
        );
        const embed = new EmbedBuilder()
            .setTitle('Done!!!')
            .setAuthor({
                name: interaction.user.username,
                iconURL: interaction.user.avatarURL(),
                url: interaction.user.bannerURL(),
            })
            .setColor(0xfdbe02)
            .setDescription(`With ${input}. Done!`);

        await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
        });

        interaction.setCooldown(1000 * 4); // 4s
    },
};
