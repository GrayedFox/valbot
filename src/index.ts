/**
 *  This is the point of entry for incoming requests sent by Discord users via slash commands to the AWS gateway
 *
 *  Refs
 *  https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html
 *  https://discord.com/developers/docs/interactions/receiving-and-responding#responding-to-an-interaction
 *  https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-type
 *
 */

import nacl from 'tweetnacl'

import { APIGatewayProxyEvent, Handler } from 'aws-lambda'

import {
  APIInteraction,
  InteractionResponseType,
  InteractionType,
} from 'discord.js'

import { commands } from './commands'
import { resultFactory } from './result-factory'

const publicKey = process.env.DISCORD_PUBLIC_KEY || ''

export const handler: Handler = async (event: APIGatewayProxyEvent) => {
  console.log('EVENT: \n' + JSON.stringify(event, null, 2))

  try {
    const signature = event.headers['x-signature-ed25519'] || ''
    const timestamp = event.headers['x-signature-timestamp'] || ''
    const body = event.body || ''

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(publicKey, 'hex')
    )

    // if request is invalid or fails verification return a 401
    if (!isVerified) {
      console.warn('UNAUTHORIZED: \n' + JSON.stringify(event, null, 2))
      return resultFactory(401, { error: 'Invalid request signature' })
    }

    // seems valid so attempt to parse the application command from the request body
    const interaction: APIInteraction = JSON.parse(body)

    // respond to Discord pings (required)
    if (interaction.type === InteractionType.Ping) {
      return resultFactory(200, { type: InteractionResponseType.Pong })
    }

    // respond to everything that isn't an application command
    if (interaction.type !== InteractionType.ApplicationCommand) {
      return resultFactory(404, { message: 'Unrecognized interaction type' })
    }

    console.log('APP_COMMAND: \n' + JSON.stringify(interaction, null, 2))

    // handle application command
    switch (interaction.data.name) {
      case 'ping':
        return commands.ping.execute()
      case 'start-valheim':
        return commands.startValheim.execute()
      case 'whoami':
        return commands.whoami.execute(interaction)
      default:
        return commands.unknown.execute()
    }
  } catch (error) {
    console.log('ERROR: \n' + JSON.stringify(error, null, 2))
    return resultFactory(500, { message: 'Internal server error' })
  }
}
