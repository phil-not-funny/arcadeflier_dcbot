const Discord = require("discord.js");

module.exports = {
  init(client) {
    const status = (queue) =>
      `Volume: \`${queue.volume}%\` | Loop: \`${
        queue.repeatMode
          ? queue.repeatMode === 2
            ? "All Queue"
            : "This Song"
          : "Off"
      }\``;
    client.distube
      .on("playSong", (queue, song) =>
        queue.textChannel.send(
          `▶ | Playing \`${song.name}\` - \`${
            song.formattedDuration
          }\`\nRequested by: ${song.user}\n${status(queue)}`
        )
      )
      .on("addSong", (queue, song) =>
        queue.textChannel.send(
          `✅ | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
        )
      )
      .on("addList", (queue, playlist) =>
        queue.textChannel.send(
          `✅ | Added \`${playlist.name}\` playlist (${
            playlist.songs.length
          } songs) to queue\n${status(queue)}`
        )
      )
      .on("error", (channel, e) => {
        if (channel)
          channel.send(
            `💢 | An error encountered: ${e.toString().slice(0, 1974)}`
          );
        else console.error(e);
      })
      .on("empty", (channel) =>
        channel.send("Voice channel is empty! Leaving the channel...")
      )
      .on("searchNoResult", (message, query) =>
        message.channel.send(`💢 | No result found for \`${query}\`!`)
      )
      .on("finish", (queue) => queue.textChannel.send("Finished playing all songs"))
      .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(
          `**Choose an option from below**\n${result
            .map(
              (song) =>
                `**${++i}**. ${song.name} - \`${song.formattedDuration}\``
            )
            .join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`
        );
      })
      .on("searchCancel", (message) =>
        message.channel.send(`💢 | Searching canceled`)
      )
      .on("searchInvalidAnswer", (message) =>
        message.channel.send(
          `💢 | Invalid answer! You have to enter the number in the range of the results`
        )
      )
      .on("searchDone", () => {});
  },
};
