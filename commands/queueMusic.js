module.exports = {
  name: "queue",
  description: "Shows you the queue",
  private: true,
  async execute(message, args, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return message.channel.send(
        `❌ | There is nothing playing!`
      );
    const q = queue.songs
      .map(
        (song, i) =>
          `${i === 0 ? "Playing:" : `${i}.`} ${song.name} - \`${
            song.formattedDuration
          }\``
      )
      .join("\n");
    message.channel.send(`❌ | **Server Queue**\n${q}`);
  },
};
