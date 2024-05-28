import 'dotenv/config'
import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { commands } from './commands'

const token = process.env.DISCORD_TOKEN || ''
const clientId = process.env.DISCORD_CLIENT_ID || ''
const guildId = process.env.DISCORD_GUILD_ID || ''

// register commands with Discord bot
const registerCommands = async () => {
  const commandData = Object.values(commands)
    .filter((command) => command && command.data)
    .map((command) => command.data)

  const rest = new REST({ version: '10' }).setToken(token)

  try {
    console.log(
      `Started refreshing ${commandData.length} application (/) commands.`
    )

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandData,
    })

    console.log('Finished refreshed application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}

// IIAFE to ensure node awaits result of registering commands
;(async () => {
  await registerCommands()
})()
