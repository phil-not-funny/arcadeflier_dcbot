const BotfuncsType = require("dcjs-botfuncs");
let Gamefuncs = new BotfuncsType();
const Discord = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

let url = "https://restcountries.com/v2/all";
let countries;

module.exports = {
  /**
   * @param {BotfuncsType} BotfuncsType
   */
  name: "countries",
  load() {
    Gamefuncs.initServers("./games.json");
    fetch(url)
      .then((file) => file.json())
      .then((data) => {
        countries = data;
      })
      .catch((e) => console.log("Error: Countries service unavailable"));
  },

  genNew(guildId, Gamefuncs) {
    const difficulty = Gamefuncs.getServerProp(guildId, "difficulty");
    let random;
    let alreadyUsed = Gamefuncs.getServerProp(guildId, "alreadyUsed") || [];
    do {
      random = countries[Math.floor(Math.random() * countries.length)];
    } while (
      (difficulty !== "extreme" &&
        !random.ancient &&
        difficulty !== "hard" &&
        !(
          (difficulty === "easy" &&
            (random.region === "Europe" ||
              random.subregion === "Americas" ||
              random.region === "Asia") &&
            random.independent &&
            !random.ancient) ||
          (difficulty === "medium" && random.independent && random.ancient)
        )) ||
      alreadyUsed.includes(random.alpha3Code)
    );
    Gamefuncs.setServerProp(guildId, "current", {
      name: random.name,
      translations: random.translations,
      code: random.alpha3Code,
    });
    alreadyUsed.push(random.alpha3Code);
    Gamefuncs.setServerProp(guildId, "alreadyUsed", alreadyUsed);
    return random;
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
                  content: "What is the name of this country?",
                  files: [random.flags.png],
                });
              }, 800);
            });
          }, 800);
        });
      }, 800);
    });
  },
  /**
   * Checks if the given string equals a country name. Some countries use non-ASCII symbols, which can be difficult to type in for the user.
   * Or maybe the user wants to type in a shortcut version of the country (like "United Arab Emirated" = "UAE").
   * @param {String} string (in most cases) user-input
   * @param {Object-String} country name of the country
   * @returns if the input equals the country name
   */
  answerEquals(string, country) {
    let correct = false;
    let altName = country.name
      .replace(/ *\([^)]*\) */g, "")
      .replace(/-/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (
      (country.code === "USA" && string.toLowerCase() === "usa") ||
      (country.code === "GBR" && string.toLowerCase() === "uk") ||
      (country.code === "ARE" && string.toLowerCase() === "uae")
    )
      return true;
    if (
      country.name.toLowerCase() === string.toLowerCase() ||
      altName.toLowerCase() === string.toLowerCase()
    ) {
      correct = true;
    } else {
      Object.entries(country.translations).forEach((t) => {
        if (!correct) {
          let name = t[1];
          let altNameT = name.replace(/ *\([^)]*\) */g, "").replace(/-/g, " ");
          if (
            name.toLowerCase() === string.toLowerCase() ||
            altNameT.toLowerCase() === string.toLowerCase()
          ) {
            correct = true;
          }
        }
      });
    }
    return correct;
  },
  /**
   *
   * @param {*} guildId
   * @returns
   */
  getCurrent(guildId, Gamefuncs) {
    return Gamefuncs.getServerProp(guildId, "current").name;
  },
};
