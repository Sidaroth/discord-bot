import Discord from 'discord.js';
import getRandomInt from '../../utils/getRandomInt';
import createQuestion from './question';
import db from '../../db/connection';
import openTriviaCategories from '../../utils/openTriviaCategories';
import dbTriviaCategories from '../../utils/dbTriviaCategories';
import axios from 'axios';

const createTriviaSession = function createTriviaSessionFunc(channel, theme, owner, limit) {
    const state = {};

    const safeWord = 'stop trivia';
    const participants = [];
    const defaultQuestionCap = 30;
    const questionPool = [];

    let isPaused = false; // used to not reduce answer time when no question is currently posted in chat. I.e when waiting for a new question to show up.
    let messageRef;
    let qCounter = 0;
    let currentQuestion;
    let isSessionActive = false;
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
            .setTitle(`Trivia Results - ${qCounter} questions.`)
            .setColor('#ff4444')
            .addField('Participants', resultStrings.join('\n'));

        state.channel.send(embed);
    }

    function pickQuestion() {
        const pick = questionPool.splice(getRandomInt(0, questionPool.length - 1), 1)[0];
        if (!pick || qCounter + 1 > state.limit) return state.stop();

        // We have a valid question
        qCounter += 1;
        currentQuestion = pick;
        const attachment = currentQuestion.getAttachment();
        return state.channel.send(`#**${qCounter}**: ${currentQuestion.getQuestionString()}`).then((ref) => {
            if (attachment) state.channel.send(attachment);
            isPaused = false;
            messageRef = ref;
        });
    }

    function processMessage(message) {
        const user = message.author;
        if (message.content.toLowerCase() === safeWord && (state.owner === user.id || message.member.roles.find('name', 'Senpai'))) {
            state.channel.send('Safe word received, stopping trivia session.');
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

        if (currentQuestion && currentQuestion.isAnswerValid(message.content)) {
            // correct answer was given. Award points, move to next question.
            isPaused = true;
            message.channel.send('Correct!');
            participantRef.correct += 1;

            setTimeout(() => state.pickQuestion(), 1500); // Set a timeout so there's some time to send embeds, messages, and allow users to read the output.
        }
    }

    function isActive() {
        return isSessionActive;
    }

    function addQuestions(rawData) {
        rawData.forEach((q) => {
            const question = createQuestion(q);
            questionPool.push(question);
        });
    }

    async function populateQuestionPool() {
        if (state.theme && dbTriviaCategories.some(th => th.toLowerCase() === state.theme.toLowerCase())) {
            db.any('SELECT * FROM trivia WHERE $1 = ANY (themes)', state.theme.toLowerCase())
                .then((res) => {
                    addQuestions(res);
                }).catch((error) => {
                    console.error(error);
                });

            return;
        }

        let triviaCategory;
        const lim = state.limit !== undefined ? state.limit : defaultQuestionCap;
        const opentdbUri = `https://opentdb.com/api.php?amount=${lim}`;

        if (state.theme) triviaCategory = openTriviaCategories.find(cat => cat.name.toLowerCase() === state.theme.toLowerCase());

        let uri = opentdbUri;
        if (triviaCategory) {
            uri = `${opentdbUri}&category=${triviaCategory.id}`;
        } else if (theme !== undefined) {
            state.channel.message.send('That doesn\'t seem to be a valid theme. Questions will be from all categories.');
        }

        const res = await axios.get(uri);
        const { data } = res;
        addQuestions(data.results);
    }

    function tick(time, delta) {
        if (isSessionActive && !isPaused) {
            if (lastMsg === 0) lastMsg = time;
            const timeSinceLastMsg = time - lastMsg;

            if (currentQuestion.hasTimeLeft()) {
                currentQuestion.tick(time, delta);

                if (timeSinceLastMsg >= 1000) { // Count down time remaining once every second.
                    lastMsg = time;
                    messageRef.edit(`#**${qCounter}**: ${currentQuestion.getQuestionString()}`);
                }
            } else {
                isPaused = true;
                // state.printStatusEmbed();
                const letterString = currentQuestion.letter ? `**${currentQuestion.letter}:** ` : '';
                state.channel.send(`Time's up! Correct answers were: ${letterString}\`${currentQuestion.valid.join(', ')}\``);
                state.pickQuestion();
            }
        }
    }

    async function start() {
        /* eslint-disable-next-line max-len */
        const msg = `Starting a new trivia session. Admins and the starting user may stop the session by writing \`${safeWord}\` in the chat.`;
        state.channel.send(msg);

        isSessionActive = true;
        isPaused = true;
        if (state.limit === undefined) state.limit = defaultQuestionCap;

        await populateQuestionPool();

        // We always start with the owner as a participant.
        participants.push({ name: owner.username, id: owner.id, correct: 0 });

        // start first question.
        state.pickQuestion();
    }

    function stop() {
        isSessionActive = false;
        state.printStatusEmbed();
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
