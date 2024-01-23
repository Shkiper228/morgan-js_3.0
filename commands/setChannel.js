const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setchannel')
        .setDescription('Установить ключовий канал')
        .addSubcommand(subcommand => 
            subcommand
                .setName('правила')
                .setDescription('Канал правил')
                .addChannelOption(option => option.setName('channel').setDescription('Оберіть канал').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('оголошення')
                .setDescription('Канал оголошень')
                .addChannelOption(option => option.setName('channel').setDescription('Оберіть канал').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('users')
                .setDescription('Канал користувачів')
                .addChannelOption(option => option.setName('channel').setDescription('Оберіть канал').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('info')
                .setDescription('Інформаційний канал')
                .addChannelOption(option => option.setName('channel').setDescription('Оберіть канал').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('general')
                .setDescription('Загальний текстовий канал')
                .addChannelOption(option => option.setName('channel').setDescription('Оберіть канал').setRequired(true)))
        .addSubcommand(subcommand => 
            subcommand
                .setName('privatevoices')
                .setDescription('Голосовий канал для створення приватних голосових каналів')
                .addStringOption(option => option.setName('privatevoicesid').setDescription('Введіть \`id\` каналу').setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(client, interaction) {
        const subCmd = interaction.options.getSubcommand()
        const channel = interaction.options.getChannel('channel')
        const privatChannelId = interaction.options.getString('privatevoicesid')
        switch (subCmd) {
            case 'правила':
                interaction.guild.setRulesChannel(channel)
                    .then(updated => interaction.reply({embeds: [{
                        description: `Канал під назвою \`${channel.name}\` було успішно встановлено як канал із правилами`,
                        color: 0x84DE02
                    }], ephemeral: true}))
                    .catch(error => interaction.reply({embeds: [{
                        description: `**Халепа, щось пішло не так Помилка:**\n${error}`,
                        color: 0xFF033E
                    }], ephemeral: true}));
                break;
            
            case 'оголошення':
                channel.setType(ChannelType.GuildAnnouncement)
                    .then(updated => interaction.reply({embeds: [{
                        description: `Канал під назвою \`${channel.name}\` було успішно встановлено як канал оголошень`,
                        color: 0x84DE02
                    }], ephemeral: true}))
                    .catch(error => interaction.reply({embeds: [{
                        description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                        color: 0xFF033E
                    }], ephemeral: true}));
                break;
                
            case 'users':
                client.GuildUsers = channel
                client.connection.query('DELETE FROM key_channels WHERE type = \"GuildUsers\"', async (error, rows) => {
                    if(error) {
                        interaction.reply({embeds: [{
                            description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                            color: 0xFF033E
                        }], ephemeral: true})
                        return
                    }

                    client.connection.query(`INSERT INTO key_channels VALUES (${channel.id}, \"GuildUsers\")`, (error, rows) => {
                        if (error) {
                            interaction.reply({embeds: [{
                                description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                                color: 0xFF033E
                            }], ephemeral: true})
                            return
                        } else {
                            interaction.reply({embeds: [{
                                description: `Канал під назвою \`${channel.name}\` було успішно встановлено як канал користувачів`,
                                color: 0x84DE02
                            }], ephemeral: true})
                        }
                    })
                })
                break;

            case 'info':
                client.GuildInfo = channel
                client.connection.query('DELETE FROM key_channels WHERE type = \"GuildInfo\"', async (error, rows) => {
                    if(error) {
                        interaction.reply({embeds: [{
                            description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                            color: 0xFF033E
                        }], ephemeral: true})
                        return
                    }

                    client.connection.query(`INSERT INTO key_channels VALUES (${channel.id}, \"GuildInfo\")`, (error, rows) => {
                        if (error) {
                            interaction.reply({embeds: [{
                                description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                                color: 0xFF033E
                            }], ephemeral: true})
                            return
                        } else {
                            interaction.reply({embeds: [{
                                description: `Канал під назвою \`${channel.name}\` було успішно встановлено як канал з загальною інформацією`,
                                color: 0x84DE02
                            }], ephemeral: true})
                        }
                    })
                })
                break;

            case 'general':
                client.GuildGeneral = channel
                client.connection.query('DELETE FROM key_channels WHERE type = \"GuildGeneral\"', async (error, rows) => {
                    if(error) {
                        interaction.reply({embeds: [{
                            description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                            color: 0xFF033E
                        }], ephemeral: true})
                        return
                    }

                    client.connection.query(`INSERT INTO key_channels VALUES (${channel.id}, \"GuildGeneral\")`, (error, rows) => {
                        if (error) {
                            interaction.reply({embeds: [{
                                description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                                color: 0xFF033E
                            }], ephemeral: true})
                            return
                        } else {
                            interaction.reply({embeds: [{
                                description: `Канал під назвою \`${channel.name}\` було успішно встановлено як канал з загальною інформацією`,
                                color: 0x84DE02
                            }], ephemeral: true})
                        }
                    })
                })
                break;

            case 'privatevoices':
                let privatChannel;
                try {
                    privatChannel = await client.guild.channels.fetch(privatChannelId)
                    client['GuildPrivateVoiceCreation'] = privatChannel
                } catch (error) {
                    interaction.reply({embeds: [{
                        description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                        color: 0xFF033E
                    }], ephemeral: true})
                    return
                }

                if(!privatChannel || privatChannel.type !== ChannelType.GuildVoice) {
                    interaction.reply({embeds: [{
                        description: `**Голосового каналу з id:\`${privatChannelId}\`, або в нього не відповідний тип`,
                        color: 0xFF033E
                    }], ephemeral: true})
                    return
                }
                client.connection.query('DELETE FROM key_channels WHERE type = \"GuildPrivateVoiceCreation\"', async (error, rows) => {
                    if(error) {
                        interaction.reply({embeds: [{
                            description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                            color: 0xFF033E
                        }], ephemeral: true})
                        return
                    }

                    client.connection.query(`INSERT INTO key_channels VALUES (${privatChannel.id}, \"GuildPrivateVoiceCreation\")`, (error, rows) => {
                        if (error) {
                            interaction.reply({embeds: [{
                                description: `**Халепа, щось пішло не так. Помилка:**\n${error}`,
                                color: 0xFF033E
                            }], ephemeral: true})
                            return
                        } else {
                            interaction.reply({embeds: [{
                                description: `Канал під назвою \`${privatChannel.name}\` було успішно встановлено як голосовий канал для створення приватних голосових каналів`,
                                color: 0x84DE02
                            }], ephemeral: true})
                        }
                    })
                })
                break;
        }
    }
}