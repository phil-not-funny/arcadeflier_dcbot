module.exports = {
  name: "skip",
  description: "Skip a song",
  private: true,
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `❌ | There is nothing in the queue right now!`
      );
    try {
      const song = await queue.skip();

      message.channel.send(`✅ | Skipped! Now playing:\n${song.name}`);
    } catch (e) {
      message.channel.send(`❌ | ${e}`);
    }
  },
};
