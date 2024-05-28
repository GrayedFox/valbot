import { InteractionResponseType, SlashCommandBuilder } from 'discord.js'
import { resultFactory } from '../../result-factory'

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Replies with pong :)')

export async function execute() {
  return resultFactory(200, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: { content: ':ping_pong:' },
  })
}
