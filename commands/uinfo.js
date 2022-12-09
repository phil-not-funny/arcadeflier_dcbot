const Discord = require("discord.js");
const Botfuncs = require("dcjs-botfuncs");
module.exports = {
  name: "uinfo",
  description: "Gets the information of a user",
  args: [{ name: "target", description: "The target of the command", type: 6 }],
  execute(message, args, author, prefix) {
    let user;
    let guildUser;
    if (!args) {
      user = author;
      guildUser = message.guild.members.cache.get(author.id);
    } else if (args.length >= 1 && !message.mentions?.users) {
      return Botfuncs.sendMessage(
        "❌  Wrong commang usage (Maybe " + prefix + "usage will help)",
        message,
        5000
      );
    } else if (args.length === 1) {
      user = message.mentions.users.first();
      guildUser = message.guild.members.cache.get(user.id);
    }
    sendEmbed(user, guildUser, author, message);
  },
  interact(interaction, options, author) {
    let user;
    let guildUser;
    if (!options.get("target")) {
      user = author;
      guildUser = interaction.guild.members.cache.get(author.id);
    } else {
      user = options.getUser("target");
      guildUser = interaction.guild.members.cache.get(user.id);
    }
    sendEmbed(user, guildUser, author, interaction);
  }
};

function sendEmbed(user, guildUser, author, message) {
  const embed = new Discord.EmbedBuilder()
      .setTitle(
        "User Info of " +
          user.username +
          (guildUser.nickname ? ` (_AKA ${guildUser.nickname}_)` : "")
      )
      .setColor(guildUser.displayHexColor || Discord.Colors.Red)
      .setDescription(
        "Created on **" +
          user.createdAt.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) +
          "**\nJoined this server on **" +
          guildUser.joinedAt.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }) +
          "**"
      )
      .setThumbnail(user.avatarURL({ format: "png", dynamic: true }))
      .setFooter({text: `Requested by ${author.username}`});
    message.reply({ embeds: [embed] });
}