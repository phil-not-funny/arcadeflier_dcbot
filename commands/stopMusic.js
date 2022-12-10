module.exports = {
  name: "stop",
  description: "Stops the music",
  private: true,
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        "❌ There is nothing in the queue right now",
        message,
        false
      );
    queue.stop();
    client.distube.voices.leave(message);
    Botfuncs.setServerProp(
      queue.textChannel.guildId,
      "distubeQLength",
      undefined
    );
    return Botfuncs.sendMessage(
      "⏹  Stopped the music and left the channel",
      message,
      false
    );
  },
};
