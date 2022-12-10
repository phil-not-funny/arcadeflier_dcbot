const Discord = require("discord.js");

module.exports = {
  init(client, Botfuncs) {
    client.distube
      .on("playSong", (queue, song) => {
        if (
          Botfuncs.getServerProp(
            queue.textChannel.guildId,
            "distubeQLength"
          ) !== queue.songs.length
        )
          queue.textChannel.send({
            embeds: [
              buildEmbed(
                `Now playing...`,
                `**Song name**: \`${song.name}\`\nSong duration: \`${song.formattedDuration}\``,
                `Requested by ${song.user.username}`,
                "▶️"
              ),
            ],
          });
        Botfuncs.setServerProp(
          queue.textChannel.guildId,
          "distubeQLength",
          queue.songs.length
        );
      })
      .on("addSong", (queue, song) => {
        queue.textChannel.send({
          embeds: [
            buildEmbed(
              `Added song to queue`,
              `**Song name**: \`${song.name}\`\nSong duration: \`${song.formattedDuration}\``,
              `Requested by ${song.user.username}`,
              "✅"
            ),
          ],
        });
      })
      .on("addList", (queue, playlist) =>
        queue.textChannel.send({
          embeds: [
            buildEmbed(
              `Added \`${playlist.name}\` to queue`,
              `A total of ${playlist.songs.length} songs were added.`,
              `Requested by ${playlist.user.username}`,
              "✅"
            ),
          ],
        })
      )
      .on("error", (channel, e) => {
        if (channel)
          channel.send(
            `💢 | An error encountered: ${e.toString().slice(0, 1974)}`
          );
        else console.error(e);
      })
      .on("empty", (channel) =>
        Botfuncs.sendMessage(
          "🖐 Voice channel is empty. Leaving...",
          { channel },
          false
        )
      )
      .on("searchNoResult", (message, query) =>
        Botfuncs.sendMessage(
          `💢 No result found for \`${query}\``,
          message,
          false
        )
      )
      .on("finish", (queue) => {
        Botfuncs.sendMessage("☑  Finished playing through queue", {
          channel: queue.textChannel,
        });
        Botfuncs.setServerProp(
          queue.textChannel.guildId,
          "distubeQLength",
          undefined
        );
      });
  },
  buildEmbed,
  status,
};

function buildEmbed(title, description, footer, emoji, image) {
  return new Discord.EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setFooter({ text: footer })
    .setImage(image)
    .setColor(Discord.resolveColor("Aqua"))
    .setAuthor({ name: emoji });
}

function status(queue) {
  return `Volume: \`${queue.volume}%\` | Loop: \`${
    queue.repeatMode
      ? queue.repeatMode === 2
        ? "All Queue"
        : "This Song"
      : "Off"
  }\``;
}
