import Discord from 'discord.js';
import snekfetch from 'snekfetch';

const trim = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);

module.exports = {
    name: 'urban',
    description: 'Provides an urban dictionary definition of the given word.',
    cooldown: 5,
    aliases: ['udb'],
    usage: '<word>',
    requiresArgs: true,
    execute(message, args) {
        const term = args.join(' ');
        snekfetch
            .get('https://api.urbandictionary.com/v0/define')
            .query({ term }) // i.e https://api.urbandictionary.com/v0/define?term=hello%20world
            .then((res) => {
                if (res.body.result_type !== 'no_results') {
                    const { tags, list } = res.body;
                    const top = list.sort((l, r) => {
                        if (l.thumbs_up < r.thumbs_up) return 1;
                        if (l.thumbs_up > r.thumbs_up) return -1;
                        return 0;
                    })[0];

                    const example = trim(top.example, 1024) || 'No example found.';
                    const embed = new Discord.RichEmbed()
                        .setColor('EFFF00')
                        .setTitle(top.word)
                        .setURL(top.permalink)
                        .addField('Definition', trim(top.definition, 1024))
                        .addBlankField(false)
                        .addField('Example', example)
                        .addBlankField(false)
                        .addField('Rating', `${top.thumbs_up} thumbs up.\n${top.thumbs_down} thumbs down.`)
                        .setFooter(`Tags: ${tags.join(', ')}`);
                    message.channel.send(embed);
                } else {
                    message.channel.send(`Urban dictionary doesn't seem to have a definition for *${term}*`);
                }
            });
    },
};
