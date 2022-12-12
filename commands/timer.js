const Discord = require("discord.js");
const BotfuncsType = require("dcjs-botfuncs");
const Botfuncs = new BotfuncsType();
module.exports = {
  name: "timer",
  description: "Will start a timer",
  args: [
    {
      name: "seconds",
      description: "The duration of the timer",
      required: true,
      type: 4,
    },
    { name: "note", description: "If and what note should be added" },
  ],
  /**
   * @param {Discord.Message} message
   * @returns
   */
  execute(message, arguments) {
    var withtext = true;

    if (!arguments)
      return sendMsg("❗️  Please enter a timespan (in seconds)", message);

    if (isNaN(arguments[0]))
      return sendMsg(
        "❗️  Time argument must be a number! (?timer <TIME> <TEXT>)",
        message
      );

    if (arguments[0] > 2147483647)
      return sendMsg("❗️  The given number is too high.", message);

    sendMsg("⌛️  Timer started!", message);

    if (!arguments[1]) withtext = false;

    var sec = 0;
    var target = parseInt(arguments[0]);
    var text = "";
    arguments.forEach((arg) => {
      if (arg !== arguments[0]) {
        text += arg + " ";
      }
    });

    function add() {
      sec++;
      timer();
    }

    function timer() {
      if (sec >= target) {
        return sendMsg(
          `🔔  ${
            message.author
          } , it has now been ${target} seconds since you started your timer.${
            withtext ? `\nNote: ${text}` : ""
          }`,
          message,
          false
        );
      }

      setTimeout(add, 1000);
    }

    timer();
    console.log(`started a timer on server ${message.guild.id}`);
  },
  interact(interaction, options, author, guildId, client, Botfuncs, prefix) {
    var withtext = true;
    var target = options.getInteger("seconds");
    var text = options.getString("note");
    if (target > 3600)
      return Botfuncs.sendInteractReply(
        "❗️  Cannot start a timer longer than one hour",
        interaction,
        true,
        true
      );
    Botfuncs.sendInteractReply(`⌛️  Timer started!\nDuration: ${target}seconds`, interaction);
    if (!options.get("note")) withtext = false;

    var sec = 0;
    function add() {
      sec++;
      timer();
    }

    function timer() {
      if (sec >= target) {
        return Botfuncs.sendMessage(
          `🔔  ${
            author
          }, it has now been ${target} seconds since you started your timer.${
            withtext ? `\nNote: ${text}` : ""
          }`,
          interaction,
          false, false, false
        );
      }

      setTimeout(add, 1000);
    }

    timer();
    console.log(`started a timer on server ${interaction.guild.id} for a duration of ${target}s`);
  },
};
