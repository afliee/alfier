const { Events } = require('discord.js');

module.exports = {
    name: Events.VoiceStateUpdate,
    async execute(args) {
        console.log('in voice state update');
    },
};
