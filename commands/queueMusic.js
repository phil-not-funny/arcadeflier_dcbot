const Discord = require("discord.js");

module.exports = {
  name: "queue",
  description: "Shows the current queue",
  async execute(message, args, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        `❌ There is nothing in the queue right now`,
        message,
        false
      );

    message.channel.send({ embeds: [buildEmbed(queue.songs[0], queue.songs)] });
  },
  interact(interaction, options, author2, guildId, client, Botfuncs) {
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        `❌ There is nothing in the queue right now`,
        interaction,
        true, true
      );

    interaction.reply({ embeds: [buildEmbed(queue.songs[0], queue.songs)] });
  }
};

function buildEmbed(active, songs) {
  let embed = new Discord.EmbedBuilder()
    .setTitle(
      `Server Queue - ${songs.length} song${songs.length > 1 ? "s" : ""}`
    )
    .setDescription(
      `**Playing**: ${active.name} - \`${active.formattedDuration}\`${
        songs.length > 1 ? `\nSongs in **queue**:` : "\nNo songs in queue"
      }`
    )
    .setColor(Discord.resolveColor("Blue"));
  if (songs.length > 1){
    songs.slice(1, 25).forEach((song, idx) => {
      embed.addFields({
        name: (idx + 1).toString(),
        value: `${song.name} - \`${song.formattedDuration}\``,
      });
    });
    if(songs.length > 25) embed.addFields({name: `and ${songs.length - 25} more`, value: "..."})
  }
  return embed;
}
