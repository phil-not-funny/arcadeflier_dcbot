const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '!';
client.commands = new Discord.Collection();
client.once('ready', () => {
	console.log('Bot ist startklar')
	client.user.setActivity({ type: "WATCHING", name: '!help'});
})
client.on('message', async message => {
	if(!message.content.startsWith(prefix) || message.author.bot) return;
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	if(command === 'tempcl'){
			message.channel.send(". \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n Diggah niemand will das sehen.")
			return;
	} else if(command === 'cl'){
		try {
			const arg = args.join(" ");
			if(!arg) return message.channel.send("Zahl angeben! (max 100)");
			await message.channel.messages.fetch({ limit: arg }).then(messages => {
            	message.channel.bulkDelete(messages)});
			message.channel.send("Nachrichten erfolgreich gelöscht");
			return;
		} catch (error) {
			message.channel.send("Zahl angeben! (max 100)");
			return;
		}
	} else if(command === '1chif'){
		message.channel.send("Ja, wieso gibst du das ein? Was glaubst du soll hier kommen? Wikipedia Artikel? ne");
	} else if(command === 'cursed'){
		const imageCursed = Math.floor(Math.random() * Math.floor(27));
		message.channel.send("wtf ", {files: [`http://clientfanhd.bplaced.net/upload/CursedPic/cursed ${imageCursed}.jpg`]});
	} else if(command === 'help'){
		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#750b0b')
			.setTitle('Alle Commands')
			//setAuthor('75ilip', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
			//.setDescription('Some description here')
			.setImage('https://i0.wp.com/design.spengergasse.at/wp-content/uploads/2019/02/htlwien5-logo.png?ssl=1')
			.addFields(
				{ name: 'cursed', value: 'Schickt eins von ~40 Shitposts', inline: true },
				{ name: 'avatar', value: 'schickt dir das Avatar von dir selbst oder jemand anderen', inline: true },
				{ name: 'cl', value: 'cleared den Chat', inline: true },
				{ name: 'tempcl', value: 'cleared den Chat temporär', inline: true },
				{ name: 'rip', value: 'press F to pay respect', inline: true },
				{ name: 'qu', value: 'beantwortet deine Fragen', inline: true },
			)
			//.addField('Inline field title', 'Some value here', true)
			//.setImage('https://i.imgur.com/wSTFkRM.png')
			//.setTimestamp()
		message.channel.send(helpEmbed);
	} else if(command === 'rip'){
		if(!message.mentions.users.size){
			message.channel.send("Bitte alle ein F in den Chat für: \n <@" + message.author + ">");
		} else {
		const target = message.mentions.users.first();
		message.channel.send("Bitte alle ein F in den Chat für: \n <@" + target + ">");
		}
	}  else if (command === 'avatar') {
        if (!message.mentions.users.size) {
            return message.channel.send(`Dein avatar: <${message.author.displayAvatarURL({ format: "png", dynamic: true })}> `);
        }
			const target = message.mentions.users.first();
			const avatarList = message.mentions.users.map(user => {
            return `${target}'s avatar: <${user.displayAvatarURL({ format: "png", dynamic: true })}> `;
        })
        message.channel.send(avatarList);
    } else if(command === 'hdf'){
		message.channel.send("Ich rede nicht mit Leuten, deren IQ nicht hoeher als die Raumtemperatur ist.")
	} else if(command === 'qu'){
		const msg = message.author.toString();
		const arg = args.join(" ");
		if(!arg) return message.channel.send("du musst auch was fragen");
		message.channel.send("Ich beantworte die Frage: " + arg );
		const random = Math.floor(Math.random() * Math.floor(8));
		const fore = "Die Antwort auf die Frage ist: "
		if(random === 0){
			message.channel.send(fore + "Ja");
		} else if(random === 1){
			message.channel.send(fore + "Nein");
		} else if(random === 2){
			message.channel.send(fore + "Vielleicht");
		} else if(random === 3){
			message.channel.send(fore + "Keine Ahnung");
		} else if(random === 4){
			message.channel.send(fore + "Sehr warscheindlich");
		} else if(random === 5){
			message.channel.send(fore + "Eher unwarscheindlich");
		} else if(random === 6){
			message.channel.send(fore + "Das glaubst du doch selber nicht");
		} else if(random === 7){
			message.channel.send(fore + "Eindeutlich! Ja");
		}
	} else {
		message.channel.send("Prefix und Command! \n (Versuche !help)")
	} 
	
})
client.login('ODA4NzM0MTU1NDQxNDM4NzMy.YCK2YA.57cM1MFzX21OOJkmsRzB1AbYVnM');