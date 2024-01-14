const { Events } = require('discord.js');
const PrivatChannel = require('../classes/PrivatChannel.js');

const voiceStateUpdate = {
    name: Events.VoiceStateUpdate,
    execute: async (client, oldState, newState) => {
        console.log(client.GuildPrivateVoiceCreation)
        if(newState.channelId == client.GuildPrivateVoiceCreation.id) {
            const channel = new PrivatChannel(client, newState.member.user.id);
            await channel.init();
            client.privat_voices.push(channel);
        }
    
        client.privat_voices.forEach(async (voice, index) => {
            if(oldState.channelId == voice.channel.id && oldState.channel.members.size == 0) {
                try {
                    client.connection.query(`DELETE FROM privat_channels WHERE id=${voice.channel.id}`)
                    await voice.channel.delete();
                    client.privat_voices.splice(index, 1)
                } catch (error) {
                    
                }
                
            }
        });
    }
}


module.exports = voiceStateUpdate;