const Discord = require("discord.js");
const BotfuncsType = require("dcjs-botfuncs");

module.exports = {
  name: "play",
  description: "Plays some funky beats",
  private: true,
  args: [{ name: "query", description: "Search query or URL", required: true }],
  /**
   *
   * @param {Discord.Message} message
   * @param {Discord.Client} client
   * @param {BotfuncsType} Botfuncs
   */
  execute(message, args, client, Botfuncs) {
    const author = message.member;
    if (!author.voice.channel)
      return Botfuncs.sendMessage(
        "⛔  You must be in a channel to use that command",
        message
      );
    if (args?.size)
      return Botfuncs.sendMessage(
        "❌  Please specify a song name/url",
        message
      );
    const query = args.join(" ");
    if (query.toLowerCase().includes("spotify.com"))
      return Botfuncs.sendMessage(
        "💢  Unsupported provider",
        message,
        5000,
        false,
        true,
        5000
      );
    client.distube.play(author.voice.channel, query, {
      member: author,
      textChannel: message.channel,
      message,
    });
  },
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   * @param {Discord.CommandInteractionOptionResolver} options
   * @param {Discord.GuildMember} author
   * @param {Discord.Client} client
   * @param {BotfuncsType} Botfuncs
   */
  interact(interaction, options, guildId, client, Botfuncs) {
    //const query = options.get("query").value;
    //const author = interaction.member;
    //client.distube.play(author.voice.channel, query, { member: author, textChannel: interaction.channel})
  },
};
