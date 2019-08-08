import Discord from 'discord.js';
import trim from '../utils/trim';
import axios from 'axios';

module.exports = {
    name: 'urban',
    description: 'Provides an urban dictionary definition of the given word.',
    cooldown: 5,
    aliases: ['udb'],
    usage: '<word>',
    requiresArgs: true,
    execute(message, args) {
        const term = args.join(' ');
        const uri = `https://api.urbandictionary.com/v0/define?term=${term}`;

        axios.get(uri).then((res) => {
            if (res.data.list.length === 0) {
                return message.channel.send(`Urban dictionary doesn't seem to have a definition for *${term}*`);
            }

            const { list } = res.data;
            const top = list.sort((l, r) => {
                if (l.thumbs_up < r.thumbs_up) return 1;
                if (l.thumbs_up > r.thumbs_up) return -1;
                return 0;
            })[0];

            const example = trim(top.example, 1024) || 'No example found.';
            const embed = new Discord.RichEmbed()
                .setColor('EFFF00')
                .setTitle(top.word[0].toUpperCase() + top.word.slice(1))
                .setURL(top.permalink)
                .addField('Definition', trim(top.definition, 1024))
                .addField('Example', example)
                .addBlankField(false)
                .addField('Rating', `${top.thumbs_up} thumbs up.\n${top.thumbs_down} thumbs down.`);

            return message.channel.send(embed);
        });
    },
};
