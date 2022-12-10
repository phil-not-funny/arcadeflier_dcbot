module.exports = {
  name: "volume",
  description: "Changes the volume in percentage",
  private: true,
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
      `${volume > 100 ? "🔊" : "🔉"} Volume set to \`${volume}\``, message, false
    );
  },
};
