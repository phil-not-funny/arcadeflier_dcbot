const { execute } = require("./arcade");

module.exports = {
  name: "loop",
  description: "Repeats the current song/queue",
  args: [
    {
      name: "mode",
      description: "The repeat mode",
      choices: ["off", "queue", "song"],
      required: true,
    },
  ],
  async execute(message, args, client, Botfuncs) {
    const queue = client.distube.getQueue(message);
    if (!queue)
      return Botfuncs.sendMessage(
        `❌ There is nothing in the queue right now`,
        message,
        false
      );
    if (!args)
      return Botfuncs.sendMessage(
        "❌ Please specify your loop-mode (`off`|`queue`|`song`)",
        message,
        false
      );
    let mode = null;
    switch (args[0]) {
      case "off":
        mode = 0;
        break;
      case "song":
        mode = 1;
        break;
      case "queue":
        mode = 2;
        break;
    }
    mode = queue.setRepeatMode(mode);
    mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";
    Botfuncs.sendMessage(`🔁 Set loop mode to \`${mode}\``, message, false);
  },
  async interact(interaction, options, author, guildId, client, Botfuncs) {
    const queue = client.distube.getQueue(interaction);
    if (!queue)
      return Botfuncs.sendInteractReply(
        `❌ There is nothing in the queue right now`,
        interaction,
        true,
        true
      );
    let mode = options.get("mode").value;
    mode = queue.setRepeatMode(mode);
    mode = mode ? (mode === 2 ? "Repeat queue" : "Repeat song") : "Off";
    Botfuncs.sendInteractReply(
      `🔁 Set loop mode to \`${mode}\``,
      interaction
    );
  },
};
