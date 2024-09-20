const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
  name: "answerme",
  description: "Will answer you all your question",
  args: [
    {
      name: "question",
      description: "The question you want to ask",
      required: true,
    },
  ],
  execute(message, args, author) {
    const answer = genRandom();
    let content = args.join(" ");
    message.channel.send(`I am answering "**${content}**" .`).then((message) =>
      setTimeout(() => {
        message.edit(`I am answering "**${content}**" . .`).then((message) =>
          setTimeout(() => {
            message
              .edit(`I am answering "**${content}**" . . .`)
              .then((message) => {
                message.delete();
                message.channel.send(
                  `<@${author.id}>, the answer to "**${content}**" is:\n\`${answer}\``
                );
              });
          }, 500)
        );
      }, 500)
    );
  },
  /**
   * @param {Discord.ChatInputCommandInteraction} interaction
   */
  interact(interaction, args, author, guildId, client, Botfuncs, prefix) {
    const answer = genRandom();
    content = args.get("question").value;
    interaction.reply(`I am answering "**${content}**" .`);
    setTimeout(() => {
      interaction.editReply(`I am answering "**${content}**" . .`);
      setTimeout(() => {
        interaction.editReply(`I am answering "**${content}**" . . .`);
        setTimeout(() => {
          interaction.editReply(
            `<@${author.id}>, the answer to "**${content}**" is:\n\`${answer}\``
          );
        }, 1000);
      }, 1000);
    }, 1000);
  },
};

function genRandom() {
  let random = Math.floor(Math.random() * 13);
  let answerString = fs.readFileSync("./commands/mystery_answers.txt", {
    encoding: "utf-8",
  });
  let answer = answerString.split("\r\n")[random];
  return answer;
}
