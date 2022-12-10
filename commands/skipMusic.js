const Discord = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skip a song",
  private: true,
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        "❌ There is nothing in the queue right now",
        message,
        false
      );
    try {
      Botfuncs.setServerProp(
        message.guildId,
        "distubeQLength",
        queue.songs.length - 1
      );
      const song = await queue.skip();

      message.channel.send({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Skipped current song")
            .setDescription(
              `Now playing: **${song.name}** - \`${song.formattedDuration}\``
            )
            .setColor(Discord.resolveColor("DarkBlue"))
            .setFooter({ text: `Requested by ${message.author.username}` }),
        ],
      });
    } catch (e) {
      Botfuncs.sendMessage(`❌ ${e}`, message, false);
    }
  },
};
