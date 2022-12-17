const distubehelper = require("../packages/distubeHelper");

module.exports = {
  name: "nowplaying",
  description: "Display the currently playing music",
  async execute(message, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        `❌ There is nothing in the queue right now`,
        message,
        false
      );
    const song = queue.songs[0];
    message.channel.send({
      embeds: [
        distubehelper.buildEmbed(
          `Now playing...`,
          `**Song name**: \`${song.name}\`\nSong duration: \`${
            song.formattedDuration
          }\`\n${distubehelper.status(queue)}`,
          `Requested by ${song.user.username}`,
          "▶️"
        ),
      ],
    });
  },
  async interact(interaction, options, author, guildId, client, Botfuncs) {
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        `❌ There is nothing in the queue right now`,
        interaction,
        true,
        true
      );
    const song = queue.songs[0];
    interaction.reply({
      embeds: [
        distubehelper.buildEmbed(
          `Now playing...`,
          `**Song name**: \`${song.name}\`\nSong duration: \`${
            song.formattedDuration
          }\`\n${distubehelper.status(queue)}`,
          `Requested by ${song.user.username}`,
          "▶️"
        ),
      ],
    });
  },
};
