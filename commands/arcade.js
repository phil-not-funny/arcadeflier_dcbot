const BotfuncsType = require("dcjs-botfuncs");
const Discord = require("discord.js");

const modes = ["countries", "general", "history"];

module.exports = {
  name: "arcade",
  /**
   * @param {Discord.Message} message
   * @param {String[]} args
   * @param {Discord.User} author
   * @param {Number} guildId
   * @param {BotfuncsType} Botfuncs
   */
  private: true,
  execute(message, args, author, guildId, Botfuncs) {
    const prefix = Botfuncs.getServerProp(guildId, "prefix");

    const usageEmbed = new Discord.EmbedBuilder()
      .setTitle("Arcade command usage")
      .setColor("DarkRed")
      .setDescription(
        "Overview of the arcade command.\n\n**Gamemodes:** _general, countries, history_"
      )
      .addFields([
        {
          name: `\`${prefix}arcade start <gamemode>\``,
          value: "Starts the game",
        },
        {
          name: `\`${prefix}arcade stop\``,
          value: "Stops the game, if not automatically",
        },
        {
          name: `\`${prefix}arcade scoreboard <gamemode>\``,
          value: "Shows the server scoreboard",
        },
      ]);

    const infoEmbed = new Discord.EmbedBuilder()
      .setTitle("Info for ARCADE")
      .setColor("DarkRed")
      .setDescription(
        `Here is some info before the game starts:\nWhen you are ready type \`${prefix}arcbegin\``
      )
      .addFields([
        {
          name: `\`${prefix}arcoptions players <...players or "@everyone">\``,
          value: "👦 Sets the game participants",
        },
        {
          name: `\`${prefix}arcoptions triviaType <"selection"|"typing">\``,
          value: "🛎 Sets the trivia type _(default: typing)_",
        },
        {
          name: `\`${prefix}arcoptions difficulty <"easy"|"medium"|"hard">\``,
          value: "🎯 Sets the game difficulty _(default: medium)_",
        },
        {
          name: `\`${prefix}arcoptions goal <number 5-45>\``,
          value:
            "🏁 Determines the required points to win the game _(default: 8)_",
        },

        {
          name: `\`${prefix}skip\``,
          value:
            "⏩ Creates a skip request. Everyone playing must use this command, in order to skip",
        },
        {
          name: "answering",
          value:
            "You answer to a question by simply _typing the answer into the chat_ (no prefix)",
        },
      ]);

    if (
      !args ||
      (args?.[0] !== "stop" &&
        args?.[0] !== "info" &&
        args?.length < 2 &&
        args?.length < 3)
    )
      return Botfuncs.sendMessage(
        "❌  Wrong commang usage (Maybe `" +
          Botfuncs.getServerProp(guildId, "prefix") +
          "arcade info` will help)",
        message
      );
    else if (args[0] === "stop") {
      if (!Botfuncs.getServerProp(guildId, "gameRunning"))
        return Botfuncs.sendMessage(
          "❌  There must be a game running to perform this command.",
          message
        );
      else {
        Botfuncs.sendMessage(
          '✅  Ended game of type "' +
            Botfuncs.getServerProp(guildId, "gameRunning") +
            '"',
          message,
          0
        );
        Botfuncs.setServerProp(guildId, "gameRunning", undefined);
        Botfuncs.setServerProp(guildId, "gameChannel", undefined);


        return;
      }
    } else if (args[0] === "start") {
      if (Botfuncs.getServerProp(guildId, "gameRunning"))
        return Botfuncs.sendMessage(
          "❌  There is already a game running. (End it with `" +
            prefix +
            "arcade stop`)",
          message
        );
      if (args[1] && modes.includes(args[1])) {
        Botfuncs.setServerProp(guildId, "gameRunning", args[1]);
        Botfuncs.setServerProp(guildId, "gameChannel", message.channelId);

        Botfuncs.sendMessage(
          '✅  Game initiated of type "' + args[1] + '"',
          message,
          0
        );
        message.channel.send({
          embeds: [infoEmbed],
        });
      }
    } else if (args[0] === "info") {
      message.channel.send({ embeds: [usageEmbed] });
    } else if (args[0] === "scoreboard") {
      const ScoreboardFuncs = new BotfuncsType();
      ScoreboardFuncs.initServers("../games/scores.json");
      const scores = ScoreboardFuncs.getServerProp(guildId, args[1]);

      if (!scores)
        return ScoreboardFuncs.sendMessage(
          "💢 You have to play a game of _" + args[1] + "_ first",
          message,
          5000
        );

    }
  },
};
