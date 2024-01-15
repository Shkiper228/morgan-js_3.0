const { ChannelType, PermissionFlagsBits } = require("discord.js");

class PrivatChannel {
    constructor (client, owner) {
        this.client = client;
        this.ownerId = owner;
    }

    async init () {
        this.owner = await this.client.guild.members.fetch(this.ownerId);
        this.channel = await this.client.guild.channels.create({
            name: `🔒 ${this.owner.displayName}`,
            type: ChannelType.GuildVoice,
            userLimit: 2,
            parent: this.client.GuildPrivateVoiceCreation.parent,
            permissionOverwrites: [
                {
                    id: this.ownerId,
                    allow: PermissionFlagsBits.ManageChannels
                }
            ]
        })

        this.owner.edit({
            channel: this.channel
        })

        this.client.connection.query(`CREATE TABLE IF NOT EXISTS privat_channels ( 
			id VARCHAR(20) NOT NULL ,
			owner VARCHAR(22),
			PRIMARY KEY (ID)
			)`
		)

        this.client.connection.query(`INSERT INTO privat_channels (id, owner) VALUES(\"${this.channel.id}\", \"${this.owner}\")`);
    }
}

module.exports = PrivatChannel;