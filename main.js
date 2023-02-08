/* ------------------------------ Requirements ------------------------------ */
const Discord = require("discord.js");
const { REST } = require("@discordjs/rest");
const GatewayIntentBits = Discord.GatewayIntentBits;
const fs = require("fs");
const BotfuncsType = require("dcjs-botfuncs");
const { Configuration, OpenAIApi } = require("openai");

/* ------------------------------- Set config ------------------------------- */
const Botfuncs = new BotfuncsType();
const { DisTube } = require("distube");
const distubehelper = require("./packages/distubeHelper");

const client = new Discord.Client({
  intents: [
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
});

const serversFile = "./servers.json";
const configFile = "./config.json";
const commandDir = module.path + "/commands";

Botfuncs.setBotConfig(configFile);
Botfuncs.initServers(serversFile);

const rest = new REST({ version: 10 }).setToken(Botfuncs.getBotConfig("token"));

const countryGames = require("./games/country-game.js");
let debugging = Botfuncs.getBotConfig("debug");

let openaiConfig;
let openai;
if(Botfuncs.getBotConfig("openaiKey")) {
  openaiConfig = new Configuration({
    apiKey: Botfuncs.getBotConfig("openaiKey"),
  });
  openai = new OpenAIApi(openaiConfig);
}

/* -------------------------------- On ready -------------------------------- */
client.once("ready", async () => {
  Botfuncs.validateServers();
  Botfuncs.setGlobalCommandDir(commandDir);
  Botfuncs.putGlobalCommandsToAPI(client.user.id, rest);

  distubehelper.init(client, Botfuncs);

  console.log("Gamebot is now ready");
  const date1 = new Date();
  console.log(date1);

  client.user.setActivity({
    type: Discord.ActivityType.Playing,
    name: "/help | " + Botfuncs.getBotConfig("prefix") + "help",
  });
  //client.user.setUsername("Arcade.Flyer");

  countryGames.load();

  if (debugging) {
    let activeGuilds = [];
    await client.guilds.fetch().then((guilds) => {
      guilds.forEach((guild) => {
        activeGuilds.push(guild.name);
      });
    });

    console.log("=====CONFSERVERS=====");
    console.log(Botfuncs.getServers());
    console.log("=====CONFSERVERS=====");
    console.log("=====SERVERS=====");
    console.log(activeGuilds);
    console.log("=====SERVERS=====");
    console.log("=====COMMANDS=====");
    console.log(Botfuncs.getCommands());
    console.log("=====COMMANDS=====");
  }
});

/* ----------------------------- On memebr join ----------------------------- */
client.on("guildMemberAdd", (member) => {
  guildId = member.guild.id;
  if (Botfuncs.getServerProp(guildId, "welcomeMembers")) {
    console.log(member.user.username + " joined server " + guildId);
    let owner = client.users.cache.get(member.guild.ownerId);
    member.send({
      embeds: [
        new Discord.EmbedBuilder()
          .setTitle("Welcome to _" + member.guild.name + "_!")
          .setDescription(
            "Hey <@" +
              member.id +
              ">,\nplease read the **rules** and complete the **verification steps**."
          )
          .setThumbnail(member.guild.iconURL())
          .addFields(
            {
              name: "Command Help",
              value:
                "Type `" +
                Botfuncs.getServerProp(guildId, "prefix") +
                "help` into the appropriate channel to list all commands of Arcade.Flyer.",
            },
            {
              name: "Command Usage",
              value:
                "Type `" +
                Botfuncs.getServerProp(guildId, "prefix") +
                "usage` into the appropriate channel to see how commands are being used.",
            }
          )
          .setFooter({
            text: "Server Owner: " + owner.username,
          }),
      ],
    });
  }
});

/* ----------------------------- On reaction add ---------------------------- */
client.on("messageReactionAdd", async (reaction) => {
  if (
    Botfuncs.getServerProp(reaction.message.guildId, "gameRunning") &&
    reaction.message.channelId ===
      Botfuncs.getServerProp(reaction.message.guildId, "gameChannel")
  ) {
    countryGames.onReaction(
      reaction,
      reaction.message,
      reaction.message.guildId,
      Botfuncs
    );
  }
});

/* ----------------------------- On interaction ----------------------------- */
client.on("interactionCreate", (interaction) => {
  Botfuncs.onInteraction(
    interaction,
    async (command, options, author, guildId, guildMember) => {
      if (
        !Botfuncs.getServerProp(guildId, "botchannel") ||
        Botfuncs.getServerProp(guildId, "botchannel") == interaction.channel.id
      ) {
        if(command === "openai")
        return Botfuncs.execInteractionCommand(command, guildId, interaction, options, author, guildId, client, Botfuncs, openai);
        else return Botfuncs.execInteractionCommand(
          command,
          guildId,
          interaction,
          options,
          author,
          guildId,
          client,
          Botfuncs,
          Botfuncs.getServerProp(guildId, "prefix")
        );
      }
      if (command == "clear")
        return Botfuncs.execInteractionCommand(
          "clear",
          guildId,
          interaction,
          options,
          guildMember,
          Botfuncs
        );
      else if (
        !(
          Botfuncs.getServerProp(guildId, "botchannel") ==
          interaction.channel.id
        )
      )
        return Botfuncs.sendInteractReply(
          `💢  Bot-Commands belong in the channel <#${Botfuncs.getServerProp(
            guildId,
            "botchannel"
          )}>`,
          interaction,
          true,
          true
        );
    }
  );
});

/* ------------------------------- On message ------------------------------- */
client.on("messageCreate", (message) => {
  if (
    Botfuncs.getServerProp(message.guildId, "gameRunning") &&
    Botfuncs.getMessageCommand(message) !== "arcade" &&
    message.channel.id ===
      Botfuncs.getServerProp(message.guildId, "gameChannel")
  )
    return countryGames.execute(
      message,
      Botfuncs.getMessageCommand(message),
      Botfuncs.getMessageArgs(message),
      message.guildId,
      Botfuncs
    );
  if (
    message.mentions.users.first() === client.user &&
    !Botfuncs.getServer(message.guildId)
  ) {
    Botfuncs.addServer(message.guild);
    return Botfuncs.execCommand(
      "help",
      message.guildId,
      message,
      null,
      Botfuncs.getBotConfig("prefix")
    );
  }

  Botfuncs.onMessage(
    message,
    async (command, args, author, guildId, usedPrefix) => {
      Botfuncs.addServer(message.guild);
      if (!args.length) args = null;
      if (debugging) {
        console.log("=====COMMAND=====");
        console.log(
          [
            "prefix: " + usedPrefix,
            command,
            args,
            guildId,
            JSON.stringify(Botfuncs.getServer(guildId)),
          ].join(",\n")
        );
        console.log("=====COMMAND=====");
      }
      if (
        !Botfuncs.getServerProp(guildId, "botchannel") ||
        message.channel.id === Botfuncs.getServerProp(guildId, "botchannel")
      ) {
        if (command === "help") {
          //help command
          return Botfuncs.execCommand(
            "help",
            guildId,
            message,
            args,
            Botfuncs.getServerProp(guildId, "prefix")
          );
        }
        if (usedPrefix === Botfuncs.getServerProp(guildId, "prefix")) {
          if (command === "set") {
            return Botfuncs.execCommand(
              "serverProperties",
              guildId,
              message,
              args,
              usedPrefix,
              guildId,
              Botfuncs
            );
          } else if (command === "usage") {
            return Botfuncs.execCommand("usage", guildId, message, usedPrefix);
          } else if (command === "avatar") {
            return Botfuncs.execCommand("avatar", guildId, message);
          } else if (command === "timer") {
            return Botfuncs.execCommand("timer", guildId, message, args);
          } else if (command === "invite") {
            return sendMsg(
              "Invite: https://discord.com/api/oauth2/authorize?client_id=895606144926621706&permissions=535827053632&scope=bot",
              message,
              false
            );
          } else if (command === "uinfo") {
            return Botfuncs.execCommand(
              "uinfo",
              guildId,
              message,
              args,
              author,
              usedPrefix
            );
          } else if (command === "answerme" || command === "answer") {
            if (!args)
              return sendMsg(
                "❌  Wrong commang usage (Maybe " +
                  Botfuncs.getServerProp(guildId, "prefix") +
                  "usage will help)",
                message
              );
            return Botfuncs.execCommand(
              "answerme",
              guildId,
              message,
              args,
              author
            );
          } else if (command === "arcade") {
            return Botfuncs.execCommand(
              "arcade",
              guildId,
              message,
              args,
              author,
              guildId,
              Botfuncs
            );
          } else if (command === "arcbegin") {
            return sendMsg(
              "❌  Wrong commang usage\n(Maybe you meant `" +
                Botfuncs.getServerProp(guildId, "prefix") +
                "arcade start <gamemode>`?)",
              message
            );
          } else if (command === "meme") {
            return Botfuncs.execCommand("meme", guildId, message);
          }
          //  MUSIC
          else if (command === "play" || command === "p") {
            return Botfuncs.execCommand(
              "play",
              guildId,
              message,
              args,
              client,
              Botfuncs
            );
          } else if (command === "skip" || command === "s") {
            return Botfuncs.execCommand(
              "skip",
              guildId,
              message,
              client,
              Botfuncs
            );
          } else if (command === "queue" || command === "q") {
            return Botfuncs.execCommand(
              "queue",
              guildId,
              message,
              args,
              client,
              Botfuncs
            );
          } else if (command === "stop") {
            return Botfuncs.execCommand(
              "stop",
              guildId,
              message,
              client,
              Botfuncs
            );
          } else if (command === "shuffle" || command === "sh") {
            return Botfuncs.execCommand(
              "shuffle",
              guildId,
              message,
              client,
              Botfuncs
            );
          } else if (command === "volume" || command === "vol") {
            return Botfuncs.execCommand(
              "volume",
              guildId,
              message,
              args,
              client,
              Botfuncs
            );
          } else if (command === "nowplaying" || command === "np") {
            return Botfuncs.execCommand(
              "nowplaying",
              guildId,
              message,
              client,
              Botfuncs
            );
          } else if (command === "loop") {
            return Botfuncs.execCommand(
              "loop",
              guildId,
              message,
              args,
              client,
              Botfuncs
            );
          }
        }
      }
      if (
        command === "downloadmedia" &&
        usedPrefix === Botfuncs.getServerProp(guildId, "prefix")
      ) {
        if (author.id !== "582610455957078016")
          sendMsg("⛔️  Only my creator may use this command", message);
        else
          Botfuncs.execCommand(
            "downloadMedia",
            guildId,
            message,
            args,
            usedPrefix,
            Botfuncs
          );
      } else if (
        (command === "clear" || command === "cl") &&
        usedPrefix === Botfuncs.getServerProp(guildId, "prefix")
      ) {
        //clear command
        Botfuncs.execCommand("clear", guildId, message, args, Botfuncs);
      } else {
        if (usedPrefix === Botfuncs.getServerProp(guildId, "prefix")) {
          if (
            !Botfuncs.getServerProp(guildId, "botchannel") ||
            message.channel.id === Botfuncs.getServerProp(guildId, "botchannel")
          ) {
            return sendMsg(
              "❌  That command does not exist. \nMaybe you should try `" +
                Botfuncs.getServerProp(guildId, "prefix") +
                "help`",
              message,
              true,
              4500
            );
          } else {
            return sendMsg(
              `💢  Bot-Commands belong in the channel <#${Botfuncs.getServerProp(
                guildId,
                "botchannel"
              )}>`,
              message,
              true,
              3000,
              true,
              true,
              3000
            );
          }
        } else if (command === "help") {
          return sendMsg(
            `💢  Bot-Commands belong in the channel <#${Botfuncs.getServerProp(
              guildId,
              "botchannel"
            )}>`,
            message,
            true,
            2500,
            true,
            true,
            2000
          );
        }
      }
    },
    () => {
      if (debugging) console.log("! bad request");
    }
  );
});

/* ----------------------------- Other functions ---------------------------- */
/**
 * sends a message with my pattern
 *
 * @param {String} reply reply message
 * @param {Discord.Message} message original message
 * @param {Boolean} delReply delete reply? (true)
 * @param {Number} timeout timeout for deleting reply (5000)
 * @param {Boolean} embed embed? (true)
 * @param {Boolean} delOrigin delete original message? (false)
 * @param {Number} delOriginTimeout delete timeout of original message (0)
 */
function sendMsg(
  reply,
  message,
  delReply = true,
  timeout = 3300,
  embed = true,
  delOrigin = false,
  delOriginTimeout = 0
) {
  if (delOrigin)
    setTimeout(() => {
      message.delete();
    }, delOriginTimeout);

  if (!embed) {
    if (delReply)
      message.channel.send(reply).then((message) =>
        setTimeout(() => {
          message.delete();
        }, timeout)
      );
    else message.channel.send(reply);
  } else {
    const embed = new Discord.EmbedBuilder()
      .setColor("#b9d918")
      .setDescription(`**${reply}**`);

    if (delReply)
      message.channel.send({ embeds: [embed] }).then((message) =>
        setTimeout(() => {
          message.delete();
        }, timeout)
      );
    else message.channel.send({ embeds: [embed] });
  }
}

client.on("error", (err) => {
  console.log("Error occured");
  console.log("-----STACKTRACE----");
  console.error(err.name + ": " + err.message);
  client.login(Botfuncs.getBotConfig("token"));
});
client.login(Botfuncs.getBotConfig("token"));
