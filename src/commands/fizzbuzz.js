import Discord from 'discord.js';

/*
 * Curry based semi-fancy fizzbuzzer.
 */
function fizzBuzzCurry(amount) {
    const curriedMod = m => i => i % m === 0;
    const funcs = {
        Fizz: curriedMod(3),
        Buzz: curriedMod(5),
        Fuzz: curriedMod(7),
        Bizz: curriedMod(11),
        Biff: curriedMod(13),
    };

    let response = '';
    for (let i = 1; i <= amount; i += 1) {
        const result = Object.keys(funcs)
            .map(key => (funcs[key](i) ? key : ''))
            .join('');

        response += `${result || i}\n`;
    }

    return `\`\`\`\n${response}\`\`\``;
}

export default {
    name: 'fizzbuzz',
    description: 'Prints fizzbuzz from 1 to <amount> (cap. 250, default 25). (fizz, buzz, fuzz, bizz, biff, 3, 5, 7, 11, 13)',
    aliases: ['fizz', 'buzz'],
    usage: ['<amount>'],
    execute: async (message, args) => {
        let amount = parseInt(args[0]) || 25;
        if (amount < 1) amount = 1;
        if (amount > 250) amount = 250;
        message.channel.send(fizzBuzzCurry(amount));
    },
};
