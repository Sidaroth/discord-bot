import createTriviaSession from './triviaSession';

const triviaModule = function triviaModuleFunc() {
    const state = {};
    let sessions = [];
    let tickTime = Date.now();
    let lastTick = Date.now();

    function hasActiveTrivia() {
        return sessions.some(s => s.isActive());
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function cleanupInactiveSessions() {
        sessions = sessions.filter(s => s.isActive());
    }

    async function tick() {
        lastTick = tickTime;
        tickTime = Date.now();
        const delta = tickTime - lastTick;
        sessions.forEach(session => session.tick(tickTime, delta));
        if (sessions.some(s => !s.isActive())) cleanupInactiveSessions();

        if (hasActiveTrivia()) {
            await sleep(250).then(() => {
                tick();
            });
        }
    }

    async function processMessage(message) {
        const sessionIdx = sessions.findIndex(session => session.channel === message.channel);
        if (sessionIdx === -1) return;

        const triviaSession = sessions[sessionIdx];
        triviaSession.processMessage(message);
    }

    async function runTrivia(message, theme, numQuestions) {
        const { channel, author } = message;
        if (sessions.find(trivia => trivia.channel)) return channel.send('Trivia session already in progress.');
        const triviaSession = createTriviaSession(channel, theme, author, numQuestions);
        sessions.push(triviaSession);
        triviaSession.start();

        tickTime = Date.now();
        lastTick = Date.now();
        if (sessions.length === 1) tick(); // Start running internal tick if this is our first and so far only session.

        return undefined;
    }

    Object.assign(state, {
        hasActiveTrivia,
        runTrivia,
        processMessage,
        tick,
    });

    return state;
};

const triviaMan = triviaModule();
export default triviaMan;
