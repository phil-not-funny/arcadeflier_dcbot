const Botfuncs = require("dcjs-botfuncs");
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
    } while (alreadyUsed.includes(random.name));

    Gamefuncs.setServerProp(guildId, "current", {
      name: random.name,
      role: random.role,
      description: random.description,
      tunables: random.tunables,
      image:
        "D:/steam/steamapps/common/Dead by Daylight/DeadByDaylight/Content/" +
        random.image,
    });
    alreadyUsed.push(random.modifier);
    Gamefuncs.setServerProp(guildId, "alreadyUsed", alreadyUsed);
    return Gamefuncs.getServerProp(guildId, "current");
  },
  newQuestion(message, random, Gamefuncs) {
    let guildId = message.guild.id;
    message.channel.send("3").then((message) => {
      setTimeout(() => {
        message.edit("2").then((message) => {
          setTimeout(() => {
            message.edit("1").then((message) => {
              setTimeout(() => {
                message.delete();
                if (
                  Gamefuncs.getServerProp(guildId, "difficulty") === "medium" ||
                  Gamefuncs.getServerProp(guildId, "difficulty") === "easy"
                )
                  message.channel.send({
                    content: "```What is the name of this perk?```",
                    footer: random.role.toUpperCase(),
                    files: [random.image],
                  });
                else if (
                  Gamefuncs.getServerProp(guildId, "difficulty") === "hard"
                )
                  message.channel.send({
                    content:
                      "```What is the name of this perk?```\n\n" +
                      this.replaceDbdDescription(
                        random.description,
                        random.tunables,
                        random.name
                      ),
                    footer: random.role.toUpperCase(),
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
    let altName = answer.name.normalize("NFD")                        // Normalize special characters (e.g., é -> e)
    .replace(/[\u0300-\u036f]/g, "")         // Remove diacritics
    .replace(/[^a-zA-Z0-9\s]/g, "")          // Remove non-alphanumeric characters
    .replace(/\s+/g, " ")                    // Replace multiple spaces with a single space
    .trim();

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
  replaceDbdDescription(description, tunables, name) {

    let flatTunables = tunables.map(arr => arr[arr.length - 1]);

    return description
      .replace(/{(\d+)}/g, function (match, index) {
        return flatTunables[index] || match;
      })
      .replaceAll(name, "███")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<\/?b>/g, "**")
      .replace(/<\/?i>/g, "_")
      .replace(/<\/?ul>/g, '')
      .replace(/<li>/g, '\n- ')
      .replace(/<\/li>/g, '');
  },
};
