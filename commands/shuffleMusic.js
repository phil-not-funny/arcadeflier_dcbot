module.exports = {
  name: "shuffle",
  description: "Shuffles the active queue",
  private: true,
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `❌ | There is nothing in the queue right now!`
      );
    queue.shuffle();
    message.channel.send("Shuffled songs in the queue");
  },
};
