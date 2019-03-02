module.exports = {
    name: 'apexmap',
    description: 'description',
    execute: async (message, args) => {
        const mapUri = 'https://i.imgur.com/eFtM62N.jpg';
        return message.channel.send(mapUri);
    },
};
