module.exports = {
    name: 'apexmap',
    description: 'description',
    execute: async (message, args) => {
        const mapUri = 'https://i.imgur.com/1gELmjO.jpg';
        return message.channel.send(mapUri);
    },
};
