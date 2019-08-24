import { Attachment } from 'discord.js';
import shuffleArray from '../../utils/shuffleArray';

// Assign a letter to each answer in a multiple choice setting.
function getLetter(idx) {
    return String.fromCharCode(65 + idx);
}

//     timeLeft: 0,
//     askTime: 0,
//     question: '', // 'Who is the daughter of the sea?
//     answers: [], // ['Jaina', 'Jaina Proudmoore']
//     possibilities: [], // Filled if question is multiple choice.
//     type: 'multiple', // 'multiple, 'boolean', 'free', 'image'.
//     resourceuri: 'https://whateveruri.com/image1.png'.
const createQuestion = function createQuestionFunc(rawData) {
    const state = {};
    const { resourceuri, id, type } = rawData;

    let {
        question, invalid, valid, themes,
    } = rawData;

    // OpenTdb uses a different naming format...
    if (invalid === undefined) invalid = rawData.incorrect_answers;
    if (valid === undefined) valid = [rawData.correct_answer];
    if (themes === undefined) themes = [rawData.category];

    let timeLeft = 30;
    let possibilities = [];
    let letter;

    // Because some questions come with encoding for certain common characters, we do some string replacement. (quotes and ampersands)
    const regexes = [{ regex: /&quot;/gi, replace: '"' }, { regex: /&amp;/gi, replace: '&' }, { regex: /&#039;/gi, replace: '\'' }];
    regexes.forEach((regex) => {
        question = question.replace(regex.regex, regex.replace);
    });

    if (type === 'multiple') {
        // Multiple choice
        possibilities = shuffleArray(invalid.concat(valid[0]));
        letter = getLetter(possibilities.findIndex(a => a === valid[0]));
    }

    function getQuestionString() {
        let questionString = `${question} - Time Remaining: ${Math.round(timeLeft)} seconds.`;

        if (type === 'multiple') {
            possibilities.forEach((pos, idx) => {
                questionString += `\n**${getLetter(idx)}:** ${pos}.`;
            });
        }

        return questionString;
    }

    function getAttachment() {
        if (type !== 'image') return undefined;

        return new Attachment(resourceuri);
    }

    function hasTimeLeft() {
        return timeLeft > 0;
    }

    function tick(time, delta) {
        timeLeft -= delta / 1000;
        if (timeLeft < 0) timeLeft = 0;
    }

    function isAnswerValid(answer) {
        const correctLetter = letter && (answer.toLowerCase() === letter.toLowerCase());
        const correctAnswer = valid.find(ans => ans.toLowerCase() === answer.toLowerCase());
        if (correctAnswer || correctLetter) {
            return true;
        }

        return false;
    }

    return Object.assign(state, {
        id,
        isAnswerValid,
        getQuestionString,
        hasTimeLeft,
        tick,
        valid,
        letter,
        getAttachment,
    });
};

export default createQuestion;
