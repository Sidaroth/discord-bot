import musicMan from '../../features/music/musicModule';

module.exports = {
    name: 'summon',
    description: 'Summons the bot to a voice channel.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        if (message.member.voiceChannel) {
            message.member.voiceChannel.join().then((connection) => {
                musicMan.setConnection(connection);
                musicMan.playNext();
            }).catch(error => console.error(error));
        } else {
            message.reply('You need to be in a voice channel first.');
        }
    },
};