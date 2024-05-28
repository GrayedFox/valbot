# valbot

`valbot` is a Discord bot that can talk to AWS. In my case that happens to be a Valheim server.

This repo doubles as a great template repository for setting up a TypeScript Node project with a lot of sensible defaults - just checkout the initial commit.

## requirements

- Node v20
- AWS CLI v2

## setup

Populate all of the following values in a local `.env` file, you can get them from your AWS account, EC2 instance details, Discord server, and Discord Bot settings.

```
DISCORD_TOKEN=""
DISCORD_PUBLIC_KEY=""
DISCORD_APP_ID=""
DISCORD_CLIENT_ID=""
DISCORD_GUILD_ID=""
SERVER_NAME=""
AWS_INSTANCE_ID=""
AWS_REGION=""
```

Now `npm install` or `npm ci` for a clean install.

## development

- `build:dev` - build standard app and output to `build` directory with `--sourcemap` flag set
- `build:prod` - build minified app and output to `dist` directory without `--sourcemap` flag set then zip up result as `valbot.zip`
- `lint` - lint all typescript files
- `lint:fix` - lint all typescript files and autofix anything fixable
- `ship:prod` - uses `aws` cli to update `valbot-lambda` function
- `start:dev` - monitor changes to `index.ts` using `nodemon`
- `register:commands` - register Discord bot commands against Discord API using `ts-node` (register commands not included in build)

Note: you'll want to call the `ship:prod` script with an IAM profile that has write access to the Lambda function, i.e. something like:

`npm run ship:prod -- --profle yourProfile`

Also please note that the discord bot **shouldn't need any AWS permissions** if it's being run inside a Lambda. The Lambda function itself should be
should be granted only those permissions it needs to get and start servers, i.e. DescribeInstance and StartInstance. That's it.

## todo

Things that need doing:

- [x] add license
- [ ] refactor start command handler and command name to use `SERVER_NAME` env var so that slash command becomes `/start-$serverName` (lowercase)
- [ ] refactor start command to require a list of role IDs for the `start-$serverName` command
- [ ] send deferred message type response for starting server to show loading spinner and then update with EC2 client response
- [ ] refactory `execute()` function to be strongly typed using interfaces and composition
