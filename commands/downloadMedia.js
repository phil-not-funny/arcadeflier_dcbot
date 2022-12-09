const Discord = require("discord.js");
const BotfuncsType = require("dcjs-botfuncs");
const fs = require("fs");
const https = require("https");

module.exports = {
  name: "downloadMedia",
  /***
   * @param {Discord.Message} message
   * @param {Array<String>} args
   * @param {BotfuncsType} Botfuncs
   */
  private: true,
  execute(message, args, prefix, Botfuncs) {
    if (!args || args.length !== 2)
      return Botfuncs.sendMessage(
        `❌  Wrong command usage\n${prefix}downloadmedia <msgcount:num> <downloadname:string>`,
        message,
        0
      );
    if (isNaN(args[0]))
      return Botfuncs.sendMessage(
        "❌  Argument 1 only allows for integers (messagecount)",
        message
      );
    if (args[0] > 300)
      return Botfuncs.sendMessage(
        "❗  Calm down boy, only 300 messages allowed",
        message
      );
    if (args[0] === 1) args[0] = 2;
    let medias = [];
    message.channel.messages
      .fetch({ limit: args[0] - 1 })
      .then(async (messages) => {
        let filteredMsgs = messages.filter((msg) => msg.attachments.size > 0);
        console.log(
          `DownloadMedia: Found ${filteredMsgs.size} messages with attachments`
        );
        filteredMsgs.forEach((msg) =>
          msg.attachments.forEach((attachment) => medias.push(attachment.url))
        );
        console.log(medias.length);
        if (!medias.length)
          return Botfuncs.sendMessage(
            "❓ No attachments found. Did you use the correct message-amount?",
            message
          );
        Botfuncs.sendMessage(
          `⏳  Downloading...\n**Attachments found: **${medias.length}`,
          message,
          0
        );
        var i = 0;
        medias.forEach((media) => {
          const dist = args[1].replace(/[<>:"/\|?*]/g, "_");
          const mediaSplitted = media.split(/[.]/g);
          const dest = `./dist/media/${dist}${i}.${
            mediaSplitted[mediaSplitted.length - 1]
          }`;

          if (!fs.existsSync("./dist/media/"))
            fs.mkdirSync("./dist/media/", { recursive: true });

          console.log(`Creating stream at ${dest}`);
          const file = fs.createWriteStream(dest);
          var request = https
            .get(media, function (response) {
              response.pipe(file);
              file.on("finish", function () {
                file.close();
                Botfuncs.sendMessage("✅  Medias successfully downloaded.");
              });
            })
            .on("error", function (err) {
              fs.unlink(dest);
            });
          i++;
        });
      });
  },
};
