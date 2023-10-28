const BotfuncsType = require("dcjs-botfuncs");
let Gamefuncs = new BotfuncsType();
const Discord = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

let url = "https://dbd.tricky.lol/api/perks";
let perks;

module.exports = {
  name: "deadbydaylight",
  async load() {
    Gamefuncs.initServers("./games.json");
    await fetch(url)
      .then((file) => file.json())
      .then((data) => {
        perks = Object.values(data);
      });
  },
  genNew(guildId, Gamefuncs) {
    let random;
    let alreadyUsed = Gamefuncs.getServerProp(guildId, "alreadyUsed") || [];
    do {
      random = perks[Math.floor(Math.random() * perks.length)];
      console.log(random);
    } while (alreadyUsed.includes(random.modifier));

    function getImgName() {
      let splitted = random.image.split("/");
      let underScoreSplit = splitted[splitted.length - 1].split("_");
      let file = underScoreSplit[underScoreSplit.length - 1];
      return file;
    }

    Gamefuncs.setServerProp(guildId, "current", {
      name: random.name,
      role: random.role,
      image:
        //"https://static.wikia.nocookie.net/deadbydaylight_gamepedia_en/images/a/a4/iconPerks_" + getImgName(),
        "C:/Users/deral/personal/Steam/steamapps/common/Dead by Daylight/DeadByDaylight/Content/" + random.image
    });
    alreadyUsed.push(random.modifier);
    Gamefuncs.setServerProp(guildId, "alreadyUsed", alreadyUsed);
    return Gamefuncs.getServerProp(guildId, "current");
  },
  newQuestion(message, random) {
    let guildId = message.guild.id;
    message.channel.send("3").then((message) => {
      setTimeout(() => {
        message.edit("2").then((message) => {
          setTimeout(() => {
            message.edit("1").then((message) => {
              setTimeout(() => {
                message.delete();
                message.channel.send({
                  content: "What is the name of this perk?",
                  footer: random.role.toUpperCase(),
                  files: [random.image],
                });
              }, 800);
            });
          }, 800);
        });
      }, 800);
    });
  },
  answerEquals(string, answer) {
    let correct = false;
    let altName = answer.name
      .replace(/ *\([^)]*\) */g, "")
      .replace(/-/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      answer.name.toLowerCase() === string.toLowerCase() ||
      altName.toLowerCase() === string.toLowerCase()
    ) {
      correct = true;
    }
    return correct;
  },
  getCurrent(guildId, Gamefuncs) {
    return Gamefuncs.getServerProp(guildId, "current").name;
  },
};
