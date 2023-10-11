import { Command } from "commander";
import prompts from "@upsided/prompts";
import { Spinner } from "@favware/colorette-spinner";
import { bold } from "colorette";
import { kebabCase, pascalCase } from "change-case";
import p from '../package.json'
import { ExecException, exec } from "child_process";

const program = new Command();

const qc = (title: string, type?: string) => ({
  title,
  value: title,
  description: type ? `(${type})` : undefined,
});

type QuestionsResponse = { [key: string]: string }

program
  .name("sico")
  .description("CLI helper for the Sicomoro discord.js framework for Bun.")
  .version(p.version);

program
  .command('upgrade')
  .alias('update')
  .description('Update the sico CLI to the latest version!')
  .action(async () => {
    const spinner = new Spinner()
    spinner.start({ text: 'Installing...' })
    const [error, stdout, sterr] = await new Promise((resolve, reject) => {
      exec('curl -fsSL https://raw.githubusercontent.com/Upsidedly/sico/main/install.sh | bash', (error, stdout, stderr) => {
        resolve([error, stdout, stderr])
      })
    }) as [ExecException | null, string, string]
    if (error) {
      console.log(error)
    }

    spinner.success({ text: stdout.match(/previous.*/)![0].replace('previous', 'Current').replace('found', 'is') + '.' })
    spinner.success({ text: stdout.match(/sico version.*/)![0].replace('sico', 'Sico') })
  })

program
  .command('create')
  .alias('new')
  .description('Scaffold a new Sicomoro project')
  .option('--name [name]', 'Name of the project')
  .action(async (options: { name?: string }) => {
    options.name ??= (await prompts({
      type: options.name ? null : 'text',
      name: 'name',
      message: 'What is the name of the project?'
    })).name
  })

program
  .command("generate")
  .aliases(["gen", "g"])
  .description("Generate an instance")
  .argument("[type]", "Type of the instance to generate")
  .action(async (type?: string) => {
    if (!type) {
      type = (
        await prompts({
          type: "select",
          name: "instance",
          message: "Which instance do you want to generate?",
          choices: [qc("Command"), qc("Listener"), qc("Prerequisite")],
        })
      ).instance;
    }

    const spinner = new Spinner();

    switch (type!.toLowerCase()) {
      case "command": {
        spinner.start();
        spinner.update({ text: "Command selected" });
        break;
      }

      case "listener": {
        const { event, name, filename, directory } = await prompts([
          {
            type: 'autocomplete',
            name: 'event',
            message: 'The event to listen to',
            choices: [
              qc("applicationCommandPermissionsUpdate"),
              qc("autoModerationActionExecution"),
              qc("autoModerationRuleCreate"),
              qc("autoModerationRuleDelete"),
              qc("autoModerationRuleUpdate"),
              qc("cacheSweep"),
              qc("channelCreate"),
              qc("channelDelete"),
              qc("channelPinsUpdate"),
              qc("channelUpdate"),
              qc("debug"),
              qc("warn"),
              qc("emojiCreate"),
              qc("emojiDelete"),
              qc("emojiUpdate"),
              qc("error"),
              qc("guildAuditLogEntryCreate"),
              qc("guildAvailable"),
              qc("guildBanAdd"),
              qc("guildBanRemove"),
              qc("guildCreate"),
              qc("guildDelete"),
              qc("guildUnavailable"),
              qc("guildIntegrationsUpdate"),
              qc("guildMemberAdd"),
              qc("guildMemberAvailable"),
              qc("guildMemberRemove"),
              qc("guildMembersChunk"),
              qc("guildMemberUpdate"),
              qc("guildUpdate"),
              qc("inviteCreate"),
              qc("inviteDelete"),
              qc("messageCreate"),
              qc("messageDelete"),
              qc("messageReactionRemoveAll"),
              qc("messageReactionRemoveEmoji"),
              qc("messageDeleteBulk"),
              qc("messageReactionAdd"),
              qc("messageReactionRemove"),
              qc("messageUpdate"),
              qc("presenceUpdate"),
              qc("ready"),
              qc("invalidated"),
              qc("roleCreate"),
              qc("roleDelete"),
              qc("roleUpdate"),
              qc("threadCreate"),
              qc("threadDelete"),
              qc("threadListSync"),
              qc("threadMemberUpdate"),
              qc("threadMembersUpdate"),
              qc("threadUpdate"),
              qc("typingStart"),
              qc("userUpdate"),
              qc("voiceStateUpdate"),
              qc("webhooksUpdate"),
              qc("interactionCreate"),
              qc("shardDisconnect"),
              qc("shardError"),
              qc("shardReady"),
              qc("shardReconnecting"),
              qc("shardResume"),
              qc("stageInstanceCreate"),
              qc("stageInstanceUpdate"),
              qc("stageInstanceDelete"),
              qc("stickerCreate"),
              qc("stickerDelete"),
              qc("stickerUpdate"),
              qc("guildScheduledEventCreate"),
              qc("guildScheduledEventUpdate"),
              qc("guildScheduledEventDelete"),
              qc("guildScheduledEventUserAdd"),
              qc("guildScheduledEventUserRemove"),
            ]
          },
          {
            type: 'text',
            name: 'name',
            message: 'The name of the listener',
            initial: (prev) => pascalCase(prev + 'Listener')
          },
          {
            type: 'text',
            name: 'filename',
            message: 'The filename of the listener',
            initial: (prev) => kebabCase(prev.replace('Listener', ''))
          },
          {
            type: 'text',
            name: 'directory',
            message: 'The directory of the listener',
            initial: 'listeners/'
          }
        ]) as QuestionsResponse
        spinner.start();
        spinner.update({ text: "Formulating content" });
        // Do string interpolation here
        spinner.success({ text: 'Formulated content' });

        spinner.start()
        spinner.update({ text: 'Locating filepath' });
        // Path joins here
        spinner.success({ text: 'Located filepath'})

        spinner.start()
        spinner.update({ text: 'Writing to file' })
        // Bun.write( filepath ,  content )
        spinner.success({ text: 'Written to successfully!' })
        spinner.success({ text: `Listener "${name}" created successfully!`})
        break;
      }

      case "prerequisite": {
        const { name, filename, directory } = await prompts([
          {
            type: "text",
            name: "name",
            message: "Prerequisite name",
          },
          {
            type: "text",
            name: "filename",
            message: "Prerequisite filename",
            initial: (prev) => kebabCase(prev),
          },
          {
            type: 'text',
            name: 'directory',
            message: 'Prerequisite directory',
            initial: 'prereqs/'
          }
        ]) as QuestionsResponse
        spinner.update({ text: "Prerequisite selected" });
        spinner.success({ text: "y" });
        spinner.start({ text: "doing sum else" });
        break;
      }

      default: {
        spinner.start();
        spinner.error({ text: `Instance ${bold(type!)} not found` });
      }
    }
  });

program
  .command("add")
  .aliases(["a"])
  .description("Add an integration")
  .argument("[name]", "Name of the integration to add")
  .action(async (name?: string) => {
    if (!name) {
      name = (
        await prompts({
          type: "select",
          name: "integration",
          message: "Which integration do you want to add?",
          choices: [qc("Prisma", "Database ORM"), qc("Turso", "Database")],
        })
      ).integration;
    }

    const spinner = new Spinner();
    spinner.start();

    switch (name!.toLowerCase()) {
      case "prisma": {
        spinner.update({ text: "Prisma selected" });
        break;
      }

      default: {
        spinner.error({ text: `Integration ${bold(name!)} not found` });
      }
    }
  });

program.parse();
