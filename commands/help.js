const Discord = require("discord.js");
const BotfuncsType = require("dcjs-botfuncs");
const Botfuncs = new BotfuncsType();
module.exports = {
  name: "help",
  description: "A list of all commands",
  args: [
    {
      name: "type",
      description: "The type of help-command (leave out for default)",
      choices: ["music"],
    },
  ],
  execute(message, args, prefix) {
    if (!args) message.channel.send({ embeds: [buildEmbed(prefix)] });
    else if (args[0] === "music")
      message.channel.send({ embeds: [buildMusicEmbed(prefix)] });
    else {
      Botfuncs.sendMessage(`❌ ${args[0]} is an unknown help type`);
    }
  },
  interact(interaction, prefix) {
    const helpOption = interaction.options.getString("type");
    if (!helpOption)
      interaction.reply({ embeds: [buildEmbed(prefix)], ephemeral: true });
    else if (helpOption === "music")
      interaction.reply({ embeds: [buildMusicEmbed(prefix)], ephemeral: true });
  },
};

function buildEmbed(prefix) {
  return new Discord.EmbedBuilder()
    .setColor("#b9d918")
    .setTitle("Commands Help")
    .setDescription(
      "**Also available as slash commands**\nThe serverwide prefix is: **" +
        prefix +
        "**"
    )
    .addFields(
      //{ name: prefix + 'start', value: 'starts a new quiz', inline: true },
      //{ name: prefix + 'stop', value: 'stops any ongoing game', inline: true },

      {
        name: prefix + "answerme\n`/answerme`",
        value: "will answer you all your question",
        inline: true,
      },
      {
        name: prefix + "arcade\n`No slash command`",
        value: "will start a game",
        inline: true,
      },
      {
        name: prefix + "avatar\n`/avatar`",
        value: "sends you the link to your avatar",
        inline: true,
      },
      {
        name: prefix + "clear\n`/clear`",
        value:
          "deletes a certain amount of messages (that are under 14 days old) or makes some space",
        inline: true,
      },
      {
        name: "`/hello`",
        value: "measures your latency",
        inline: true,
      },
      {
        name: prefix + "meme\n`/meme`",
        value: "will send a random video meme\nmake sure the channel is nsfw",
        inline: true,
      },
      {
        name: prefix + "set\n`/serverproperties`",
        value: "changes a server property (e.g: prefix)",
        inline: true,
      },
      {
        name: prefix + "timer\n`/timer`",
        value: "creates a timer, measured time in seconds",
        inline: true,
      },
      {
        name: prefix + "uinfo\n`/uinfo`",
        value: "returns you info to a specific user or yourself",
        inline: true,
      },
      {
        name: prefix + "usage\n`/usage`",
        value: 'shows the "syntax" of all the commands',
        inline: true,
      }
    );
}

function buildMusicEmbed(prefix) {
  return new Discord.EmbedBuilder()
    .setColor("#b9d918")
    .setTitle("Music Commands")
    .setDescription(
      "~~Also available as slash commands~~\nThe serverwide prefix is: **" +
        prefix +
        "**"
    )
    .addFields(
      //{ name: prefix + 'start', value: 'starts a new quiz', inline: true },
      //{ name: prefix + 'stop', value: 'stops any ongoing game', inline: true },

      {
        name: prefix + "play",
        value: "Plays a song",
        inline: true,
      },{
        name: prefix + "skip",
        value: "Skips the current song",
        inline: true,
      },{
        name: prefix + "queue",
        value: "Shows the current queue",
        inline: true,
      },{
        name: prefix + "shuffle",
        value: "Shuffles the current queue",
        inline: true,
      },{
        name: prefix + "stop",
        value: "Stops playing music",
        inline: true,
      },
    );
}
