export default {
    name: 'avatar',
    description: 'Displays the users avatar.',
    cooldown: 5,
    aliases: ['icon', 'pfp'],
    execute(message, args) {
        if (!message.mentions.users.size) {
            return message.channel.send(`Your avatar: ${message.author.displayAvatarURL}`);
        }

        const avatarList = message.mentions.users.map(user => `${user.username}'s avatar: ${user.displayAvatarURL}`);
        return message.channel.send(avatarList);
    },
};
