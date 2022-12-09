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
  load() {
    Gamefuncs.initServers("./games/game_countries.json");
    fetch(url)
      .then((file) => file.json())
      .then((data) => {
        countries = data;
      });
  },
  /**
   *
   * @param {Discord.MessageReaction} reaction
   * @param {Discord.Message} message
   * @param {String | Number} guildId
   * @param {BotfuncsType} Botfuncs
   */
  onReaction(reaction, message, guildId, Botfuncs) {
    console.log([
      Gamefuncs.getServerProp(guildId, "reactionMessage") === message.id,
      isParticipating(reaction.users.cache.last(), guildId),
      Gamefuncs.getServerProp(guildId, "triviaType") === "selection",
      !reaction.me,
    ]);
    if (
      Gamefuncs.getServerProp(guildId, "reactionMessage") === message.id &&
      isParticipating(message.author.id, guildId) &&
      Gamefuncs.getServerProp(guildId, "triviaType") === "selection" &&
      !reaction.me
    ) {
      console.log("entered");
      if (reaction.emoji.name === "1️⃣") {
        console.log("success");
      }
    }
    console.log("no enter");
  },
  /**
   * @param {BotfuncsType} Botfuncs
   * @param {String[]} args
   * @param {Discord.Message} message
   */
  execute(message, command, args, guildId, Botfuncs) {
    const prefix = Gamefuncs.getServerProp(guildId, "prefix");
    if (args.length === 0) args = null;
    if (message.channelId === Botfuncs.getServerProp(guildId, "gameChannel")) {
      Gamefuncs.addServer(message.guild, false, {
        id: guildId,
        name: Botfuncs.getServerProp(guildId, "name"),
        prefix: Botfuncs.getServerProp(guildId, "prefix"),
        goal: 8,
        difficulty: "medium",
        triviaType: "typing",
      });
      if (
        (message.content.startsWith(prefix) && command && args) ||
        command === "arcbegin" ||
        command === "skip"
      ) {
        if (Gamefuncs.getServerProp(guildId, "current") && command !== "skip")
          return Gamefuncs.sendMessage(
            "❌ Commands are not allowed during the game!",
            message,
            5000,
            true,
            true,
            5100
          );
        if (command === "arcoptions") {
          if (args[0] === "players") {
            if (message.mentions.users.size < 1)
              return Gamefuncs.sendMessage(
                "❌  Please tag at least one player.",
                message
              );
            let mentions = [];
            if (args[1] === "@everyone") {
              message.channel.members.forEach((user) => {
                if (!user.bot) mentions.push(user.id);
              });
            } else {
              message.mentions.users.forEach((user) => {
                if (!user.bot) mentions.push(user.id);
              });
            }
            Gamefuncs.setServerProp(guildId, "participants", mentions);
            let pingMentions = [];
            mentions.forEach((uid) => {
              pingMentions.push(`<@${uid}>`);
            });
            Gamefuncs.sendMessage(
              "👦  Participants have been set to:\n" + pingMentions.join(", "),
              message,
              0
            );
          } else if (args[0] === "goal") {
            if (isNaN(args[1]) || args[1] < 5 || args[1] > 45)
              return Gamefuncs.sendMessage(
                "❌  The required amount of points to win can only be a number from 5-45.",
                message,
                5000
              );
            Gamefuncs.setServerProp(guildId, "goal", Number.parseInt(args[1]));
            Gamefuncs.sendMessage(
              "🏁  The required amount of points to win have been set to:\n" +
                args[1],
              message,
              0
            );
          } else if (args[0] === "difficulty") {
            if (["easy", "medium", "hard"].includes(args[1].toLowerCase())) {
              Gamefuncs.setServerProp(
                guildId,
                "difficulty",
                args[1].toLowerCase()
              );
              Gamefuncs.sendMessage(
                "🎯 The difficulty has been set to: " + args[1],
                message
              );
            } else
              Gamefuncs.sendMessage(
                "❌ " + args[1] + " is not a difficulty!",
                message
              );
          } else if (args[0] === "triviaType") {
            if (["selection", "typing"].includes(args[1].toLowerCase())) {
              Gamefuncs.setServerProp(guildId, "triviaType", args[1]);
              Gamefuncs.sendMessage(
                "🛎 Trivia type has been set to " + args[1],
                message,
                0
              );
            } else
              Gamefuncs.sendMessage(
                "❌ " + args[1] + " is not a valid trivia type!",
                message
              );
          }
        } else if (command === "arcbegin") {
          const participants = Gamefuncs.getServerProp(guildId, "participants");
          if (!participants)
            return Gamefuncs.sendMessage(
              `❗  You need to set the **participants** first.\n\`${prefix}arcoptions players ...\``,
              message,
              5000
            );
          let scoreboard = [];
          participants.forEach((uid) => {
            scoreboard.push({ uid: uid, score: 0 });
          });
          Gamefuncs.setServerProp(guildId, "scores", scoreboard);

          Gamefuncs.sendMessage(
            `⚡  Game started!\n\n❗ First to reach a total of ${Gamefuncs.getServerProp(
              guildId,
              "goal"
            )} points wins the game!\n\n☘ Good Luck!`,
            message,
            0
          );
          newQuestion(message, genNewRandom(guildId));
        } else if (
          command === "skip" &&
          isParticipating(message.author.id, guildId)
        ) {
          const participants = Gamefuncs.getServerProp(guildId, "participants");
          let skipRequest =
            Gamefuncs.getServerProp(guildId, "skipRequest") || [];
          if (!skipRequest.includes(message.author.id)) {
            skipRequest.push(message.author.id);
            if (skipRequest.length === 1)
              Gamefuncs.sendMessage(
                `⏩ <@${
                  message.author.id
                }> wants to skip.\nAll in favor? If so, type \`${Botfuncs.getServerProp(
                  guildId,
                  "prefix"
                )}skip\`\n(${skipRequest.length} / ${participants.length})`,
                message,
                0
              );
            else
              Gamefuncs.sendMessage(
                `⏩ <@${message.author.id}> agreed to a skip.\n(${skipRequest.length} / ${participants.length})`,
                message,
                6000
              );
            Gamefuncs.setServerProp(guildId, "skipRequest", skipRequest);
            if (skipRequest.length === participants.length) {
              Gamefuncs.sendMessage(`✅ Question skipped`, message, 0);
              newQuestion(message, genNewRandom(guildId));
            }
          }
        }
      }

      if (
        isParticipating(message.author.id, guildId) /*&&
        Gamefuncs.getServerProp(guildId, "triviaType") === "typing"*/
      ) {
        if (
          Gamefuncs.getServerProp(guildId, "current") &&
          countryEquals(
            message.content,
            Gamefuncs.getServerProp(guildId, "current")
          )
        ) {
          const random = genNewRandom(guildId); // instant new random due to latenz
          Gamefuncs.setServerProp(guildId, "skipRequest", undefined);
          const author = message.author.id;
          addScore(author, 1, guildId);
          Gamefuncs.sendMessage(
            "✅ That's correct!\n<@" +
              author +
              "> now has `" +
              getScore(author, guildId) +
              "/" +
              Gamefuncs.getServerProp(guildId, "goal") +
              "` points.",
            message,
            0,
            true
          );
          if (
            getScore(author, guildId) ===
            Gamefuncs.getServerProp(guildId, "goal")
          ) {
            Gamefuncs.sendMessage(
              "🎉  <@" +
                author +
                "> has won the game with " +
                getScore(author, guildId) +
                " points!",
              message,
              0
            );
            removeGameserverProps(guildId);
            return require("../commands/arcade.js").execute(
              message,
              ["stop"],
              message.author,
              guildId,
              Botfuncs
            );
          }
          newQuestion(message, random);
        }
      }
    }
  },
};

function isParticipating(uid, guildId) {
  let found = false;
  Gamefuncs.getServerProp(guildId, "participants")?.forEach(
    (participatingId) => {
      if (participatingId === uid) found = true;
    }
  );
  return found;
}

function getScore(uid, guildId) {
  let found = 0;
  Gamefuncs.getServerProp(guildId, "scores").forEach((score) => {
    if (score.uid === uid) found = score.score;
  });
  return found;
}

function addScore(uid, points, guildId) {
  let scores = Gamefuncs.getServerProp(guildId, "scores");
  scores.forEach((score) => {
    if (score.uid === uid) score.score += points;
  });
  Gamefuncs.setServerProp(guildId, "scores", scores);
}

function genNewRandom(guildId) {
  const difficulty = Gamefuncs.getServerProp(guildId, "difficulty");
  let random;
  let alreadyUsed = Gamefuncs.getServerProp(guildId, "alreadyUsed") || [];
  do {
    random = countries[Math.floor(Math.random() * countries.length)];
  } while (
    (difficulty !== "hard" &&
      !(
        (difficulty === "easy" &&
          (random.region === "Europe" ||
            random.subregion === "Americas" ||
            random.region === "Asia") &&
          random.independent === true) ||
        (difficulty === "medium" && random.independent === true)
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
}

function removeGameserverProps(guildId) {
  Gamefuncs.setServerProp(guildId, "scores", undefined);
  Gamefuncs.setServerProp(guildId, "current", undefined);
  Gamefuncs.setServerProp(guildId, "alreadyUsed", undefined);
}

function newQuestion(message, random) {
  let guildId = message.guild.id;
  message.channel.send("3").then((message) => {
    setTimeout(() => {
      message.edit("2").then((message) => {
        setTimeout(() => {
          message.edit("1").then((message) => {
            setTimeout(() => {
              message.delete();
              if (Gamefuncs.getServerProp(guildId, "triviaType") === "typing") {
                message.channel.send({
                  content: "What is the name of this country?",
                  files: [random.flags.png],
                });
              } else if (
                Gamefuncs.getServerProp(guildId, "triviaType") === "selection"
              ) {
                let options = [];
                const difficulty = Gamefuncs.getServerProp(
                  guildId,
                  "difficulty"
                );
                //options generate
                while (options.length < 3) {
                  let random;
                  do {
                    do {
                      random =
                        countries[Math.floor(Math.random() * countries.length)];
                    } while (
                      difficulty !== "hard" &&
                      !(
                        (difficulty === "easy" &&
                          (random.region === "Europe" ||
                            random.subregion === "Americas" ||
                            random.region === "Asia") &&
                          random.independent === true) ||
                        (difficulty === "medium" && random.independent === true)
                      )
                    );
                  } while (
                    options.includes(
                      random.name
                        .replace(/ *\([^)]*\) */g, "")
                        .replace(/-/g, " ")
                    ) &&
                    Gamefuncs.getServerProp(guildId, "alreadyUsed")?.includes(
                      random.alpha3Code
                    )
                  );
                  options.push(
                    random.name.replace(/ *\([^)]*\) */g, "").replace(/-/g, " ")
                  );
                }
                //generate end
                let correctName = random.name
                  .replace(/ *\([^)]*\) */g, "")
                  .replace(/-/g, " ");
                options.push(correctName);
                function shuffleOptions(array) {
                  for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                  }
                  return array;
                }
                options = shuffleOptions(options);

                let fieldOptions = [];
                options.forEach((opt) => {
                  fieldOptions.push({
                    name: options.indexOf(opt) + 1 + "",
                    value: opt,
                  });
                });

                Gamefuncs.setServerProp(
                  guildId,
                  "correctPick",
                  options.indexOf(correctName) + 1
                );
                console.log(options);
                message.channel
                  .send({
                    embeds: [
                      new Discord.EmbedBuilder()
                        .setImage(random.flags.png)
                        .setTitle("What is the name of this country?")
                        .setDescription("Pick one")
                        .addFields(fieldOptions),
                    ],
                  })
                  .then((message) => {
                    Gamefuncs.setServerProp(
                      guildId,
                      "reactionMessage",
                      message.id
                    );
                    message.react("1️⃣");
                    message.react("2️⃣");
                    message.react("3️⃣");
                    message.react("4️⃣");
                  });
              }
            }, 800);
          });
        }, 800);
      });
    }, 800);
  });
}

/**
 * Checks if the given string equals a country name. Some countries use non-ASCII symbols, which can be difficult to type in for the user.
 * Or maybe the user wants to type in a shortcut version of the country (like "United Arab Emirated" = "UAE").
 * @param {String} string (in most cases) user-input
 * @param {Object-String} countryName name of the country
 * @returns if the input equals the country name
 */
function countryEquals(string, country) {
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
}
