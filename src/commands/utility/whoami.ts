import {
  APIInteraction,
  InteractionResponseType,
  SlashCommandBuilder,
} from 'discord.js'

import { resultFactory } from '../../result-factory'

export const data = new SlashCommandBuilder()
  .setName('whoami')
  .setDescription('Provides information about the user')

export async function execute(interaction: APIInteraction) {
  return resultFactory(200, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: `You are the mighty ${interaction.member?.user.username} and your user id is: ${interaction.member?.user.id}`,
    },
  })
}
