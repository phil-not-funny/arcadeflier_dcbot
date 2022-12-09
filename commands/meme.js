const Discord = require("discord.js");
const BotfuncsType = require("dcjs-botfuncs");
const fs = require("fs");
module.exports = {
  name: "meme",
  description: "Sends a random meme. NSFW channel reccommended",
  /**
   * @param {Discord.Message} message
   */
  execute(message) {
    const Botfuncs = new BotfuncsType();
    if(!message.channel.nsfw) return Botfuncs.sendMessage(`❌  This command may only be used in an _nsfw channel_`, message)
    const path = "D:/Aufnahmen/andere Videos/Memes/actual memes";
    fs.readdir(path, null, (err, files) => {
      if (err)
        return Botfuncs.sendMessage(
          "❌  An error occued while perfoming this command.",
          message
        );
      const meme = files[Math.floor(Math.random() * files.length)];
      fs.stat(`${path}/${meme}`, (err, stats) => {
        Botfuncs.sendMessage(
          "⏳  Sending ...",
          message,
          !err ? Math.round((stats.size / 1000)) : 3000,
          true
        );
        //console.log(`size ${Math.round((stats.size / 1000))}`);
        message.channel.send({ files: [`${path}/${meme}`] });
      });
    });
  },
  interact(interaction) {
    const Botfuncs = new BotfuncsType();
    if(!interaction.channel.nsfw) return Botfuncs.sendInteractReply(`❌  This command may only be used in an _nsfw channel_`, interaction, true, true)
    const path = "D:/Aufnahmen/andere Videos/Memes/actual memes";
    fs.readdir(path, null, (err, files) => {
      if (err)
        return Botfuncs.sendInteractReply(
          "❌  An error occued while perfoming this command.",
          interaction, true, true
        );
      const meme = files[Math.floor(Math.random() * files.length)];
      fs.stat(`${path}/${meme}`, async (err, stats) => {
        Botfuncs.sendInteractReply(
          "⏳  Sending ...",
          interaction,
          true, false
        );
        //console.log(`size ${Math.round((stats.size / 1000))}`);
        setTimeout(() => {
          interaction.editReply({ files: [`${path}/${meme}`], ephemeral: false, embeds: [] });
        }, 1000);
      });
    });
  }
};

function getRandom() {
  
}