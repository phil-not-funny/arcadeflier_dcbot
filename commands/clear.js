const BotfuncsType = require("dcjs-botfuncs");
const Discord = require("discord.js");
module.exports = {
  name: "clear",
  description: "Clears a amount of messages/Makes some space in the chat",
  args: [
    {
      name: "amount_or_temp",
      description:
        "The amount of messages to delete or 'temp' for shoveling space",
      required: true,
    },
  ],
  async execute(message, args, Botfuncs) {
    if (!args)
      return Botfuncs.sendMessage(
        '❗️  Either enter a number or use "temp" to make some space in the chat.',
        message
      );
    let arg = args.join(" ");
    if (isNaN(arg) && arg !== "temp")
      return Botfuncs.sendMessage(
        `❌  ${arg} is not a valid argument`,
        message
      );
    if (arg > 100)
      return Botfuncs.sendMessage(
        "❌  Cannot more than 100 messages.",
        message
      );
    else if (arg === 100) arg = 99;
    if (arg === "temp") {
      message.channel.send(
        ".\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n."
      );
      return Botfuncs.sendMessage(
        "✅  Chat was cleaned up successfully.",
        message,
        true,
        3000,
        true,
        true
      );
    }
    if (
      !message.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      ) ||
      !message.member.permissions.has(
        Discord.PermissionFlagsBits.ManageMessages
      )
    ) {
      return Botfuncs.sendMessage(
        "⛔️  You do not have the permission to perform this command.",
        message
      );
    } else {
      var delNumber = Number.parseInt(arg) + 1;
      if (deleteMessages(delNumber, message))
        Botfuncs.sendMessage(
          `✅  Successfully deleted ${arg} ${
            arg == 1 ? "message" : "messages"
          }.`,
          message
        );
      else
        Botfuncs.sendInteractReply(
          `❗  Not all messages could be deleted.\nOne or more messages are older than 14 days`,
          interaction,
          true,
          false,
          5000
        );
    }
  },
  /**
   * @param {BotfuncsType} Botfuncs
   */
  async interact(
    interaction,
    args,
    author2,
    guildId,
    client,
    Botfuncs,
    prefix
  ) {
    let arg = args.get("amount_or_temp").value;
    if (isNaN(arg) && arg !== "temp")
      return Botfuncs.sendInteractReply(
        `❌  ${arg} is not a valid argument`,
        interaction,
        true,
        true
      );
    if (arg > 100)
      return Botfuncs.sendInteractReply(
        `❌  Cannot delete more than 100 messages.`,
        interaction,
        true,
        true
      );
    if (arg === "temp") {
      return interaction.reply(
        ".\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n."
      );
    }
    const author = interaction.member;
    if (
      !author.permissions.has(Discord.PermissionFlagsBits.Administrator) ||
      !author.permissions.has(Discord.PermissionFlagsBits.ManageMessages)
    ) {
      return Botfuncs.sendInteractReply(
        "⛔️  You do not have the permission to perform this command.",
        interaction,
        true,
        true
      );
    } else {
      var delNumber = Number.parseInt(arg);
      if (deleteMessages(delNumber, interaction))
        Botfuncs.sendInteractReply(
          `✅  Successfully deleted ${arg} ${
            arg == 1 ? "message" : "messages"
          }.`,
          interaction,
          true,
          false,
          5000
        );
      else
        Botfuncs.sendInteractReply(
          `❗  Not all messages could be deleted.\nOne or more messages are older than 14 days`,
          interaction,
          true,
          false,
          5000
        );
    }
  },
};

async function deleteMessages(delNumber, calledType) {
  let success = true;
  await calledType.channel.messages
    .fetch({
      limit: delNumber,
    })
    .then((messages) => {
      if (messages.size < delNumber) success = false;
      calledType.channel.bulkDelete(messages, true).catch((err) => {
        console.log("Error occured in deleteCommand:");
        console.error(err);
      });
    });
  return success;
}
