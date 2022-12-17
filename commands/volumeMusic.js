module.exports = {
  name: "volume",
  description: "Changes the musics volume in percentage",
  args: [
    {
      name: "percentage",
      description: "volume in percentage",
      required: true,
      type: 4,
    },
  ],
  async execute(message, args, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        "❌ There is nothing in the queue right now",
        message,
        false
      );
    const volume = parseInt(args[0]);
    if (isNaN(volume))
      return Botfuncs.sendMessage(
        `❌ ${args[0]} is not a valid number`,
        message,
        false
      );
    queue.setVolume(volume);
    Botfuncs.sendMessage(
      `${volume > 100 ? "🔊" : "🔉"} Volume set to \`${volume}\``,
      message,
      false
    );
  },
  async interact(interaction, options, author, guildId, client, Botfuncs) {
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        "❌ There is nothing in the queue right now",
        interaction,
        true,
        true
      );
    const volume = options.get("percentage").value;
    queue.setVolume(volume);
    Botfuncs.sendInteractReply(
      `${volume > 100 ? "🔊" : "🔉"} Volume set to \`${volume}\``,
      interaction
    );
  },
};
