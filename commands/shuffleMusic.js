module.exports = {
  name: "shuffle",
  description: "Shuffles the active queue",
  private: true,
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage("❌ There is nothing in the queue right now", message, false)
    queue.shuffle();
    Botfuncs.sendMessage("🔀 Shuffled songs in the queue", message, false)
  },
};
