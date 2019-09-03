import triviaMan from '../features/trivia/triviaModule';
import openTriviaCategories from '../utils/openTriviaCategories';
import dbTriviaCategories from '../utils/dbTriviaCategories';

export default {
    name: 'trivia',
    description:
        'Starts a trivia session. Defaults to 30 questions. If no theme is specified, it will use questions from all themes. `!trivia list` will show available themes.',
    cooldown: 1,
    guildOnly: false,
    usage: '<theme> <number of questions>',
    execute: async (message, args) => {
        const [theme, numQuestions] = args;

        if (theme && theme.toLowerCase() === 'list') {
            message.channel.send(`Available themes are \`${dbTriviaCategories.join(', ')}, ${openTriviaCategories.map(cat => cat.name).join(', ')}\``);
        } else {
            triviaMan.runTrivia(message, theme, numQuestions);
        }
    },
};
