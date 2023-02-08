module.exports = {
  name: "openai",
  description: "commands featuring openai",
  args: [
    {
      name: "service",
      description: "openai service",
      choices: ["chat", "image"],
      required: true,
    },
  ],
  interact(interaction, options, author, guildId, client, Botfuncs, openai) {

  },
};
