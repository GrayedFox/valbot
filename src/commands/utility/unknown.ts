import { InteractionResponseType } from 'discord.js'
import { resultFactory } from '../../result-factory'

// Unlike other commands this one has no data and isn't registered
// it's used as a fallback/easter egg for handling unknown slash commands
export const data = undefined

export async function execute() {
  return resultFactory(200, {
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content:
        'Woah:interrobang: Easy there, you seem to have triggered an unknown command. Naughty naughty.',
    },
  })
}
