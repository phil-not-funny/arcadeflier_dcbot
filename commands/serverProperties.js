const Discord = require("discord.js");
const BotfuncsType = require("dcjs-botfuncs");
module.exports = {
  name: "serverProperties",
  description: "Modifies the server properties/Lists up all properties",
  args: [
    {
      name: "property",
      description: "The property, which value should be changed",
      choices: ["prefix", "botchannel", "welcomeMembers"],
      required: true,
    },
    {
      name: "new_value",
      description: "The new value, which the property should be set to",
      required: true,
    },
  ],
  execute(message, args, prefix, guildId, Botfuncs) {
    if (
      !message.member.permissions.has(Discord.PermissionFlagsBits.Administrator)
    )
      return Botfuncs.sendMessage(
        "⛔️  Only an administrator can change the server-wide settings.",
        message
      );
    if (!args) {
      return message.channel.send({ embeds: [buildEmbed(prefix)] });
    } else if (args.length <= 1)
      return Botfuncs.sendMessage(
        "❌  Wrong commang usage (Maybe " +
          Botfuncs.getServerProp(guildId, "prefix") +
          "usage will help)",
        message
      );

    const prop = args[0];
    if (prop === "prefix") {
      if (setServerProperty(message, guildId, "prefix", args[1], Botfuncs))
        Botfuncs.sendMessage(
          "✅  Serverwide Prefix changed to " + args[1],
          message,
          false
        );
    } else if (prop === "botchannel") {
      if (setServerProperty(message, guildId, "botchannel", args[1], Botfuncs))
        Botfuncs.sendMessage(
          `✅  Bot-Channel changed to ${args[1]}`,
          message,
          false
        );
    } else if (prop === "welcomeMembers") {
      if (
        setServerProperty(message, guildId, "welcomeMembers", args[1], Botfuncs)
      )
        Botfuncs.sendMessage(
          "✅ Welcoming Members is now turned " + args[1].toUpperCase(),
          message,
          false
        );
    } else {
      Botfuncs.sendMessage(
        `❌  "${prop}" is an unknown server property.`,
        message
      );
    }
  },
  /**
   * @param {BotfuncsType} Botfuncs
   */
  interact(interaction, args, guildId, Botfuncs) {
    if (
      !interaction.member.permissions.has(
        Discord.PermissionFlagsBits.Administrator
      )
    )
      return Botfuncs.sendInteractReply(
        "⛔️  Only an administrator can change the server-wide settings.",
        interaction,
        true,
        true
      );

    const prop = args.get("property").value;
    const newValue = args.get("new_value").value;
    if (prop === "prefix") {
      if (
        setServerProperty2(interaction, guildId, "prefix", newValue, Botfuncs)
      )
        Botfuncs.sendInteractReply(
          "✅  Serverwide Prefix changed to " + newValue,
          interaction
        );
    } else if (prop === "botchannel") {
      if (
        setServerProperty2(
          interaction,
          guildId,
          "botchannel",
          newValue,
          Botfuncs
        )
      )
        Botfuncs.sendInteractReply(
          `✅  Bot-Channel changed to ${newValue}`,
          interaction
        );
    } else if (prop === "welcomeMembers") {
      if (
        setServerProperty2(
          interaction,
          guildId,
          "welcomeMembers",
          newValue,
          Botfuncs
        )
      )
        Botfuncs.sendInteractReply(
          "✅ Welcoming Members is now turned " + newValue.toUpperCase(),
          interaction
        );
    } else {
      Botfuncs.sendInteractReply(
        `❌  "${prop}" is an unknown server property.`,
        interaction,
        true,
        true
      );
    }
  },
};

function buildEmbed(prefix) {
  const embed = new Discord.EmbedBuilder()
    .setColor("#750b0b")
    .setTitle("Setting Server Properties")
    .setDescription(prefix + "set <property> <value>")
    .addFields(
      {
        name: prefix + "set prefix <new prefix>",
        value: "changes the server-wide prefix",
      },
      {
        name: prefix + 'set botchannel <botchannel | "none">',
        value: "changes the server-wide bot channel, or removes it",
      },
      {
        name: prefix + "set welcomeMembers <on | off>",
        value: "will welcome members with a DM",
      }
    );
  return embed;
}

function setServerProperty(message, guildId, property, newValue, Botfuncs) {
  if (property === "prefix") {
    if (newValue.length < 9)
      Botfuncs.setServerProp(guildId, property, newValue);
    else {
      Botfuncs.sendMessage(
        "❌  Prefix must have fewer than 9 characters.",
        message
      );
      return false;
    }
  } else if (property === "botchannel") {
    if (message.mentions.channels.first()) {
      Botfuncs.setServerProp(
        guildId,
        property,
        message.mentions.channels.first().id
      );
    } else if (newValue === "none") {
      if (Botfuncs.getServerProp(guildId, "botchannel"))
        Botfuncs.setServerProp(guildId, property, null);
      else {
        Botfuncs.sendMessage(
          "❌  You must define a bot-channel first.",
          message
        );
        return false;
      }
    } else {
      Botfuncs.sendMessage(`❌ ${newValue} is not a valid channel`, message);
      return false;
    }
  } else if (property === "welcomeMembers") {
    if (newValue === "on" || newValue === "true") {
      if (!Botfuncs.getServerProp(guildId, "welcomeMembers")) {
        Botfuncs.setServerProp(guildId, "welcomeMembers", true);
        return true;
      } else {
        Botfuncs.sendMessage(
          "❌ Welcoming members is already turned on.",
          message
        );
        return false;
      }
    } else if (newValue === "off" || newValue === "false") {
      if (!Botfuncs.getServerProp(guildId, "welcomeMembers")) {
        Botfuncs.sendMessage(
          "❌ Welcoming members is already turned off.",
          message
        );
        return false;
      } else {
        Botfuncs.setServerProp(guildId, "welcomeMembers", false);
        return true;
      }
    } else {
      Botfuncs.sendMessage(
        `❌ ${newValue} is not a valid state (ON|OFF)`,
        message
      );
      return false;
    }
  }

  console.log(
    `Changed Property ${property} to ${newValue} in Server ${guildId}`
  );
  return true;
}

function setServerProperty2(
  interaction,
  guildId,
  property,
  newValue,
  Botfuncs
) {
  if (property === "prefix") {
    if (newValue.length < 9)
      Botfuncs.setServerProp(guildId, property, newValue);
    else {
      Botfuncs.sendInteractReply(
        "❌  Prefix must have fewer than 9 characters.",
        interaction,
        true,
        true
      );
      return false;
    }
  } else if (property === "botchannel") {
    newValue = newValue.replace(/[<>#]/g, "")
    if (interaction.guild.channels.cache.get(newValue)) {
      Botfuncs.setServerProp(
        guildId,
        property,
        newValue
      );
    } else if (newValue === "none") {
      if (Botfuncs.getServerProp(guildId, "botchannel"))
        Botfuncs.setServerProp(guildId, property, null);
      else {
        Botfuncs.sendInteractReply(
          "❌  You must define a bot-channel first.",
          interaction,
          true,
          true
        );
        return false;
      }
    } else {
      Botfuncs.sendInteractReply(
        `❌ ${newValue} is not a valid channel`,
        interaction,
        true,
        true
      );
      return false;
    }
  } else if (property === "welcomeMembers") {
    if (newValue === "on" || newValue === "true") {
      if (!Botfuncs.getServerProp(guildId, "welcomeMembers")) {
        Botfuncs.setServerProp(guildId, "welcomeMembers", true);
        return true;
      } else {
        Botfuncs.sendInteractReply(
          "❌ Welcoming members is already turned on.",
          interaction,
          true,
          true
        );
        return false;
      }
    } else if (newValue === "off" || newValue === "false") {
      if (!Botfuncs.getServerProp(guildId, "welcomeMembers")) {
        Botfuncs.sendInteractReply(
          "❌ Welcoming members is already turned off.",
          interaction,
          true,
          true
        );
        return false;
      } else {
        Botfuncs.setServerProp(guildId, "welcomeMembers", false);
        return true;
      }
    } else {
      Botfuncs.sendInteractReply(
        `❌ ${newValue} is not a valid state (ON|OFF)`,
        interaction, true, true
      );
      return false;
    }
  }

  console.log(
    `Changed Property ${property} to ${newValue} in Server ${guildId}`
  );
  return true;
}
