import Discord from 'discord.js';
import getRandomInt from '../utils/getRandomInt';

const createTriviaSession = function createTriviaSessionFunc(channel, theme, owner, limit) {
    const state = {};

    const safeWord = 'stop trivia';
    const defaultTimeLimit = 10;
    const participants = [];
    let question = {
        timeLeft: 0,
        askTime: 0,
        question: '',
        answers: [],
    };

    let onHold = false;
    let messageRef;
    let qCounter = 0;

    let isSessionActive = false;
    let questionPool = [];
    let lastMsg = 0;

    function printStatusEmbed() {
        const embed = new Discord.RichEmbed();
        const resultStrings = [];

        participants.sort((a, b) => a.correct < b.correct); // Sort by descending order.
        for (let i = 0; i < participants.length; i += 1) {
            const player = participants[i];
            resultStrings.push(`#**${i + 1}**: ${player.name} - **${player.correct}** correct answers`);
        }

        embed
            .setTitle(`Trivia Results - ${qCounter} questions`)
            .setColor('#ff4444')
            .addField('Participants', resultStrings.join('\n'));

        state.channel.send(embed);
    }

    function getQuestionString() {
        return `#**${qCounter}**: ${question.question} - Time Remaining: ${Math.round(question.timeLeft)}`;
    }

    function pickQuestion() {
        const pick = questionPool.splice(getRandomInt(0, questionPool.length - 1), 1)[0];
        if (!pick || qCounter + 1 > state.limit) return state.stop();

        // We have a valid question
        qCounter += 1;
        question = pick;
        question.timeLeft = defaultTimeLimit;

        return state.channel.send(getQuestionString()).then((ref) => {
            onHold = false;
            messageRef = ref;
            question.askTime = Date.now();
        });
    }

    function processMessage(message) {
        const user = message.author;
        if (message.content.toLowerCase() === safeWord && (state.owner === user.id || message.member.roles.find('name', 'Senpai'))) {
            state.channel.send('Safe word received, stopping trivia session.');
            state.printStatusEmbed();
            state.stop();
            return;
        }

        const participantRef = participants.find(u => u.id === user.id);
        if (!participantRef) {
            participants.push({
                name: user.username,
                id: user.id,
                correct: 0,
            });
        }

        if (question && question.answers.find(a => a.toLowerCase() === message.content.toLowerCase())) {
            // correct answer was given. Award points, move to next question.
            onHold = true;
            message.channel.send('Correct!');
            participantRef.correct += 1;

            state.printStatusEmbed();
            setTimeout(() => state.pickQuestion(), 1500); // Set a timeout so there's some time to send embeds, messages, and allow users to read the output.
        }
    }

    function isActive() {
        return isSessionActive;
    }

    // TODO: get question pool from API or DB.
    function populateQuestionPool() {
        questionPool = [
            {
                question: 'Is this a hard question?',
                answers: ['yes', 'no'],
            },
        ];
    }

    function tick(time, delta) {
        if (isSessionActive && !onHold) {
            if (lastMsg === 0) lastMsg = time;
            const timeSinceLastMsg = time - lastMsg;

            // If we're out of time.
            if (time > question.askTime + defaultTimeLimit * 1000) {
                onHold = true;
                state.printStatusEmbed();
                state.channel.send(`Time's up! The answer(s) was: \`${question.answers.join(', ')}\``);

                setTimeout(() => state.pickQuestion(), 1500); // Set a timeout so there's some time to send embeds, messages, and allow users to read the output.
            } else {
                question.timeLeft -= delta / 1000;
                if (question.timeLeft < 0) question.timeLeft = 0;
                if (timeSinceLastMsg > 1000) {
                    lastMsg = time;
                    messageRef.edit(getQuestionString());
                }
            }
        }
    }

    function start() {
        state.channel.send(`Starting a new trivia session. Admins and the starting user may stop the session by wrting \`${safeWord}\` in the chat.`);
        isSessionActive = true;
        populateQuestionPool();
        participants.push({ name: owner.username, id: owner.id, correct: 0 }); // We always start with the owner as a participant.

        // start first question.
        state.pickQuestion();
    }

    function stop() {
        isSessionActive = false;
    }

    Object.assign(state, {
        channel,
        theme,
        owner: owner.id,
        limit,
        isActive,
        stop,
        start,
        tick,
        processMessage,
        pickQuestion,
        printStatusEmbed,
    });

    return state;
};

export default createTriviaSession;
