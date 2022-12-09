module.exports = {
  name: "stop",
  description: "Stops the music",
  private: true,
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `❌ | There is nothing in the queue right now!`
      );
    queue.stop();
    client.distube.voices.leave(message);
    message.channel.send(`❌ | Stopped!`);
  },
};
