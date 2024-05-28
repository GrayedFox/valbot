import { InteractionResponseType, SlashCommandBuilder } from 'discord.js'

import {
  EC2Client,
  DescribeInstanceStatusCommand,
  DescribeInstanceStatusRequest,
  StartInstancesRequest,
  StartInstancesCommand,
} from '@aws-sdk/client-ec2'

import { resultFactory } from '../../result-factory'

const region = process.env.AWS_REGION || ''
const instanceId = process.env.AWS_INSTANCE_ID || ''
const serverName = process.env.SERVER_NAME || ''

const commandResults: Record<string, string> = {
  success: ':green_circle:',
  warning: ':orange_circle:',
  error: ':red_circle:',
  skip: ':sailboat:',
}

export const data = new SlashCommandBuilder()
  .setName('start-valheim')
  .setDescription('Spins up the Valehim server')

export async function execute() {
  // aws ec2 client
  const client = new EC2Client({ region })

  // aws queries
  const getStatusQuery: DescribeInstanceStatusRequest = {
    InstanceIds: [instanceId],
    IncludeAllInstances: true,
  }

  const startInstanceQuery: StartInstancesRequest = {
    InstanceIds: [instanceId],
  }

  const getStatusCommand = new DescribeInstanceStatusCommand(getStatusQuery)
  const startInstanceCommand = new StartInstancesCommand(startInstanceQuery)

  // cmd variables
  let instanceState
  let reply = ''

  try {
    // get the ec2 instance status
    const getStatusResponse = await client.send(getStatusCommand)

    instanceState = getStatusResponse.InstanceStatuses?.[0]?.InstanceState?.Name

    console.log(`EC2_INSTANCE_STATE: ${instanceState}`)

    const isReady = instanceState === 'stopped'
    const isRunning = instanceState === 'running'
    const isBusy = !isReady && !isRunning

    // if the server is busy or in an unknown state we skip command exeuction and reply with a warning
    if (isBusy) {
      reply = `${commandResults.warning} **${serverName}** is \`${instanceState}\` - please wait until it's ready before issuing the start command`
    }

    // if the server is running we skip command execution and reply with a sailboat
    if (isRunning) {
      reply = `${commandResults.skip} **${serverName}** is already \`${instanceState}\` - go forth and be a Viking`
    }

    // if the server is stopped we execute the start command and reply with a success message
    if (isReady) {
      const startInstanceResponse = await client.send(startInstanceCommand)

      instanceState =
        startInstanceResponse.StartingInstances?.[0]?.CurrentState?.Name

      reply = `${commandResults.success} **${serverName}** is \`${instanceState}\` - it should be up in 2-3 minutes`
    }

    // if something goes wrong respond with an error message and log it on cloud watch
  } catch (error) {
    console.error(error)
    reply = `${commandResults.error} **${serverName}** is \`${instanceState}\` - please contact the valbot administrator Thor`
  } finally {
    // always close ec2 connection no matter what
    client.destroy()
    return resultFactory(200, {
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content: reply },
    })
  }
}
