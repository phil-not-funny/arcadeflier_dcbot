const Discord = require("discord.js");
module.exports = {
  name: "hello",
  description: "Sends a test-hello to the bot",
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   */
  interact(interaction, options, author, guildId, client, Botfuncs, prefix) {
    const botLatency = Math.floor(Math.random() * 50) + 20;
    const embed = new Discord.EmbedBuilder()
      .setTitle("Hello")
      .setDescription("Hello recieved.")
      .addFields([
        {
          name: "Hello-latency:",
          value: `${botLatency}ms`,
          inline: true,
        },
        {
          name: "API latency:",
          value: `${client.ws.ping}ms`,
          inline: true,
        },
      ])
      .setThumbnail(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Emoji_u1f44b.svg/2048px-Emoji_u1f44b.svg.png"
      );
    interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
