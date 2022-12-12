const Discord = require("discord.js");
module.exports = {
  name: "avatar",
  description: "Gets a user's or your avatar",
  args: [
    { name: "target", description: "The target of your command", type: 6 },
  ],
  execute(message) {
    if (!message.mentions.users.size) {
      return sendMsg(
        `🖼️  Your avatar:`,
        message,
        message.author.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 2048
        })
      );
    }
    const target = message.mentions.users.first();
    sendMsg(
      `🖼️  ${target}'s avatar:`,
      message,
      target.avatarURL({
        format: "png",
        dynamic: true,
        size: 2048
      }),
      message
    );
  },
  interact(interaction, options, author, guildId, client, Botfuncs, prefix) {
    if (!options.get("target")) {
      return sendMsg(
        `🖼️  Your avatar:`,
        interaction,
        author.displayAvatarURL({
          format: "png",
          dynamic: true,
          size: 2048
        }),
        interaction
      );
    }
    const target = options.getUser("target");
    sendMsg(
      `🖼️  ${target}'s avatar:`,
      interaction,
      target.displayAvatarURL({
        format: "png",
        dynamic: true,
        size: 2048
      })
    );
  },
};

function sendMsg(reply, message, img) {
  const embed = new Discord.EmbedBuilder()
    .setColor("#b9d918")
    .setDescription(`**${reply}**`)
    .setImage(img);
  message.reply({ embeds: [embed] });
}
