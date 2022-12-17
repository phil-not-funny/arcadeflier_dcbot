module.exports = {
  name: "stop",
  description: "Stops playing music and leaves the channel",
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
  async interact(interaction, options, author, guildId, client, Botfuncs) {
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        `❌ There is nothing in the queue right now`,
        interaction,
        true,
        true
      );
    queue.stop();

    client.distube.voices.leave(interaction);
    Botfuncs.setServerProp(guildId, "distubeQLength", undefined);
    return Botfuncs.sendInteractReply(
      "⏹  Stopped the music and left the channel",
      interaction
    );
  },
};
