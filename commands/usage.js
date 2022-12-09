const Discord = require("discord.js");
module.exports = {
  name: "usage",
  description: "Lists up the command usages",
  execute(message, prefix) {
    message.reply({ embeds: [buildEmbed(prefix)] });
  },
  interact(interaction, prefix) {
    interaction.reply({ embeds: [buildEmbed(prefix)], ephemeral: true });
  },
};

function buildEmbed(prefix) {
  const embed = new Discord.EmbedBuilder()
    .setColor("#750b0b")
    .setTitle("Usage of the Commands")
    .setDescription("**<@895606144926621706> is moving to slash commands**\n<val> - ARGUMENT | *<opt>* - OPTIONAL ARGUMENT")

    .addFields(
      {
        name: prefix + "answerme `/answerme`",
        value: prefix + "answerme <...question>",
      },
      {
        name: prefix + "arcade `No slash command`",
        value: prefix + "arcade <start|stop> <gamemode>",
      },
      { name: prefix + "avatar `/avatar`", value: prefix + "avatar *<user>*" },
      {
        name: prefix + "clear `/clear`",
        value: prefix + 'clear <number or "temp">',
      },
      { name: "`/hello`", value: "/hello" },
      { name: prefix + "meme `/meme`", value: prefix + "meme" },
      {
        name: prefix + "set `/serverproperties`",
        value:
          prefix + "set <property> <value>\n(" + prefix + "set for more info)",
      },
      {
        name: prefix + "timer `/timer`",
        value: prefix + "timer <time in seconds> *<note>*",
      },
      { name: prefix + "uinfo `/uinfo`", value: prefix + "uinfo *<user>*" }
    );
  return embed;
}
