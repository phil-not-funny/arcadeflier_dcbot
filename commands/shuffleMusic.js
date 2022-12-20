module.exports = {
  name: "shuffle",
  description: "Shuffles the active queue",
  async execute(message, client, Botfuncs) {
    if (!message.member.voice.channel)
      return Botfuncs.sendMessage(
        "⛔  You must be in a channel to use that command",
        message
      );
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        "❌ There is nothing in the queue right now",
        message,
        false
      );
    queue.shuffle();
    Botfuncs.sendMessage("🔀 Shuffled songs in the queue", message, false);
  },
  async interact(interaction, options, author, guildId, client, Botfuncs) {
    if (!interaction.member.voice.channel)
      return Botfuncs.sendMessage(
        "⛔  You must be in a channel to use that command",
        message
      );
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        `❌ There is nothing in the queue right now`,
        interaction,
        true,
        true
      );
    queue.shuffle();
    Botfuncs.sendInteractReply("🔀 Shuffled songs in the queue", interaction);
  },
};
