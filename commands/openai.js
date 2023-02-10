const Discord = require("discord.js");

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
    {
      name: "prompt",
      description: "the prompt for the ai",
      required: true,
    },
  ],
  /**
   *
   * @param {Discord.ChatInputCommandInteraction} interaction
   */
  async interact(
    interaction,
    options,
    author,
    guildId,
    client,
    Botfuncs,
    openai
  ) {
    interaction.reply("OpenAI is thinking");
    if (options.get("service").value === "chat") {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: options.get("prompt").value,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const answer = response.data.choices[0].text;
      interaction.editReply({
        content: null,
        embeds: [buildEmbedChat(options.get("prompt").value, answer)],
      });
    } else if (options.get("service").value === "image") {
      const response = await openai.createImage({
        prompt: options.get("prompt").value,
        n: 1,
        size: "1024x1024",
      });
      const image = response.data.data[0].url;
      interaction.editReply({
        content: null,
        embeds: [buildEmbedImg(options.get("prompt").value, image)],
      });
    }
  },
};

function buildEmbedChat(prompt, answer) {
  return new Discord.EmbedBuilder()
    .setTitle(`Given: ${prompt}`)
    .setDescription(`**Returned:**${answer}`)
    .setFooter({
      text: "Provided by OpenAI",
      iconURL: "https://www.openai.com",
    })
    .setThumbnail(
      "https://openai.com/content/images/2022/05/openai-avatar.png"
    );
}

function buildEmbedImg(prompt, url) {
  return new Discord.EmbedBuilder()
    .setTitle(`Given: ${prompt}`)
    .setImage(url)
    .setFooter({
      text: "Provided by OpenAI",
      iconURL: "https://www.openai.com",
    })
}
