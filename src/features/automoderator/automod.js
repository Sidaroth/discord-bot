import { Attachment } from 'discord.js';

const filter = ['nigger', 'nigga', 'n1gga', 'n1gger', 'nlgga', 'nlgger'];

// Just some naive filtering for starters.
const automod = function automodFunc(message) {
    const msg = message.content.replace(/ /gi, '');
    let badWordFound = false;

    filter.forEach((filterString) => {
        if (msg.toLowerCase().includes(filterString)) {
            badWordFound = true;
        }
    });

    if (badWordFound) {
        // delete msg??
        message.channel.send(new Attachment('https://i.imgflip.com/sbalj.jpg'));
    }
};

export default automod;
