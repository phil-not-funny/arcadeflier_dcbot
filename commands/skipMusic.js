const Discord = require("discord.js");

module.exports = {
  name: "skip",
  description: "Skips the current song",
  async execute(message, client, Botfuncs) {
    if (!message.member.voice.channel)
      return Botfuncs.sendMessage(
        "⛔  You must be in a channel to use that command",
        message
      );
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
  async interact(interaction, options, author, guildId, client, Botfuncs) {
    if (!interaction.member.voice.channel)
      return Botfuncs.sendMessage(
        "⛔  You must be in a channel to use that command",
        message
      );
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        `❌ There is nothing in the queue right now`,
        interaction,
        true,
        true
      );
    try {
      Botfuncs.setServerProp(
        guildId,
        "distubeQLength",
        queue.songs.length - 1
      );
      const song = await queue.skip();

      interaction.reply({
        embeds: [
          new Discord.EmbedBuilder()
            .setTitle("Skipped current song")
            .setDescription(
              `Now playing: **${song.name}** - \`${song.formattedDuration}\``
            )
            .setColor(Discord.resolveColor("DarkBlue"))
            .setFooter({ text: `Requested by ${author.username}` }),
        ],
      });
    } catch (e) {
      Botfuncs.sendInteractReply(`❌ ${e}`, interaction, true);
    }
  },
};
