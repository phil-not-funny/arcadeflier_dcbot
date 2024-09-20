const Discord = require("discord.js");
const fs = require("fs");
const BotfuncsType = require("dcjs-botfuncs");
let Gamefuncs = new BotfuncsType();
let ScoreboardFuncs = new BotfuncsType();

let gameModes = [];

module.exports = {
  load() {
    Gamefuncs.initServers("./games/games.json");
    ScoreboardFuncs.initServers("./games/scores.json");

    const gameFiles = fs
      .readdirSync("./games")
      .filter((file) => file.endsWith("game.js"));

    gameFiles.forEach((file) => {
      const game = require("./" + file);
      game.load();
      gameModes.push(game);
    });
  },
  /**
   * @param {BotfuncsType} Botfuncs
   * @param {String[]} args
   * @param {Discord.Message} message
   */
  execute(message, command, args, guildId, Botfuncs) {
    const prefix = Gamefuncs.getServerProp(guildId, "prefix");
    const gamemode = gameModes.find(
      (game) => game.name === Botfuncs.getServerProp(guildId, "gameRunning")
    );
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
        message.content.startsWith(prefix) && message.author.id !== Botfuncs.getServerProp(guildId, "gameHoster") &&
        command !== "skip"
      )
        return Gamefuncs.sendMessage(
          "🚫 Only the host can perform these commands", message, 5000, false, true, 5000
        );

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
            5200
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
          participants.forEach((id) => {
            scoreboard.push({ uid: id, score: 0 });
          });

          Gamefuncs.setServerProp(guildId, "scores", scoreboard);

          if (!ScoreboardFuncs.getServer(guildId))
            ScoreboardFuncs.addServer(guildId, false, {
              id: guildId,
              name: Botfuncs.getServerProp(guildId, "name"),
              players: scoreboard.map((player) => {
                return {
                  uid: player.uid,
                  gamemodes: [
                    {
                      name: gamemode.name,
                      score: 0,
                      wins: 0,
                    },
                  ],
                };
              }),
            });
          else {
          }

          Gamefuncs.sendMessage(
            `⚡  Game started!\n\n❗ First to reach a total of ${Gamefuncs.getServerProp(
              guildId,
              "goal"
            )} points wins the game!\n\n☘ Good Luck!`,
            message,
            0
          );
          gamemode.newQuestion(message, gamemode.genNew(guildId, Gamefuncs), Gamefuncs);
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
              Gamefuncs.sendMessage(
                `The correct answer was: ${gamemode.getCurrent(
                  message.guild.id,
                  Gamefuncs
                )}`,
                message,
                0
              );
              gamemode.newQuestion(
                message,
                gamemode.genNew(guildId, Gamefuncs),
                Gamefuncs
              );
              Gamefuncs.setServerProp(guildId, "skipRequest", undefined);
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
          gamemode.answerEquals(
            message.content,
            Gamefuncs.getServerProp(guildId, "current")
          )
        ) {
          const random = gamemode.genNew(guildId, Gamefuncs); // instant new random due to latency
          Gamefuncs.setServerProp(guildId, "skipRequest", undefined);
          const author = message.author.id;
          addScore(author, 1, guildId, gamemode);
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

            // add win to server statistics.
            let loadedPlayers = ScoreboardFuncs.getServerProp(
              guildId,
              "players"
            );
            //loadedPlayers.find((p) => p.uid === author).gamemodes.find((g) => g.name === gamemode.name).wins += 1;
            ScoreboardFuncs.setServerProp(guildId, "players", loadedPlayers);

            //remove props and stop game
            removeGameserverProps(guildId);
            return require("../commands/arcade.js").execute(
              message,
              ["stop"],
              message.author,
              guildId,
              Botfuncs
            );
          }
          gamemode.newQuestion(message, random, Gamefuncs);
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

function addScore(uid, points, guildId, gamemode) {
  let scores = Gamefuncs.getServerProp(guildId, "scores");
  scores.find((score) => score.uid === uid).score += points;
  Gamefuncs.setServerProp(guildId, "scores", scores);

  let players = ScoreboardFuncs.getServerProp(guildId, "players");
  //players.find((p) => p.uid === uid).gamemodes.find((g) => g.name === gamemode.name).score += points;
  ScoreboardFuncs.setServerProp(guildId, "players", players);
}

function removeGameserverProps(guildId) {
  Gamefuncs.setServerProp(guildId, "scores", undefined);
  Gamefuncs.setServerProp(guildId, "current", undefined);
  Gamefuncs.setServerProp(guildId, "alreadyUsed", undefined);
}
