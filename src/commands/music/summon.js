import musicMan from '../../features/music/musicModule';

export default {
    name: 'summon',
    description: 'Summons the bot to a voice channel.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        if (message.member.voice.channel) {
            message.member.voice.channel.join().then((connection) => {
                musicMan.setConnection(connection);
                musicMan.playNext();
            }).catch(error => console.error(error));
        } else {
            message.reply('You need to be in a voice channel first.');
        }
    },
};
