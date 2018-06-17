import Discord from 'discord.js';

module.exports = {
    name: 'embed',
    description: 'Embed testing',
    execute(message, args) {
        const embed = new Discord.RichEmbed();
        embed.setTitle('Embed title');
        embed.setAuthor('Author name, bulbasaur!!');
        embed.setDescription('This is a rich embed object');
        embed.setFooter('This is the footer text. Updated 17-06-18 or something.');
        embed.setColor('#00AE86');
        embed.setImage('http://i.imgur.com/yVpymuV.png');
        embed.setThumbnail('http://i.imgur.com/p2qNFag.png');
        embed.setTimestamp();
        embed.setURL('https://sidaroth.no');

        message.channel.send({ embed });
    },
};
