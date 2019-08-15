import triviaMan from '../features/trivia';

module.exports = {
    name: 'trivia',
    description: 'Starts a trivia session. If `0` is set as number of questions, it will go through all, or until stopped. If no theme is specified, it will go use questions from all tags',
    cooldown: 1,
    guildOnly: false,
    usage: '<number of questions> <theme>',
    execute: async (message, args) => {
        const [numQuestions, theme] = args;
        triviaMan.runTrivia(message, theme, numQuestions);
    },
};
