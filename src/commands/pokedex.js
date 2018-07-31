module.exports = {
    name: 'pokedex',
    description: 'Provides an urban dictionary definition of the given word.',
    cooldown: 5,
    aliases: ['dex'],
    usage: '<pokemon>, type <type>, ability <ability>',
    requiresArgs: true,
    execute(message, args) {
        const command = args.shift();
        if (command === '') return;

        if (command === 'type') {
            // do something with type checking.
        } else if (command === 'ability') {
            // do something with abilities.
        } else {
            // assume we're looking for a pokemon then...
        }
    },
};
