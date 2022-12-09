const Discord = require("discord.js");
module.exports = {
    name: "show",
    private: true,
    execute(message, arguments, servers) {
        if (!arguments[0])
            return sendMsg("❌  Please enter a valid argument", message);
        if (arguments[0] === "servers") {
            const embed = new Discord.EmbedBuilder()
                .setColor("#750b0b")
                .setTitle("Bot Info")
                .setAuthor(
                    "made by not funny#8951",
                    "https://cdn.discordapp.com/avatars/582610455957078016/46cb6a2fb9e23c4ea18ba9c79976b538.png",
                    "https://www.proxreal.tk");
            servers.forEach(server => {
                
                embed.addField({
                    name: server.name,
                    value: `Prefix: ${server.prefix}${(server.botchannel) ? " | Bot-Channel: " + server.botchannel : ""}${(server.cdtime) ? " | CDTime: " + server.cdtime : ""}`
                });
            });
            return message.channel.send({embeds: [embed]});
        } else {
            return sendMsg(`❌  Unknown Argument: ` + arguments[0], message);
        }
    },
};

function sendMsg(reply, message, delReply = true, timeout = 4500, embed = true, delOrigin = false, delOriginTimeout = 0) {
    if (delOrigin)
        message.delete({
            timeout: delOriginTimeout
        });

    if (!embed) {
        if (delReply)
            message.channel.send(reply).then(message => message.delete({
                timeout: timeout
            }));
        else message.channel.send(reply);
    } else {
        const embed = new Discord.EmbedBuilder()
            .setColor('#b9d918')
            .setDescription(`**${reply}**`);

        if (delReply)
            message.channel.send(embed).then(message => message.delete({
                timeout: timeout
            }));
        else
            message.channel.send({embeds: [embed]});
    }
}