const getClassString = function getClassStringFunc(classId) {
    const classNames = [
        'Warrior',
        'Paladin',
        'Hunter',
        'Rogue',
        'Priest',
        'Death Knight',
        'Shaman',
        'Mage',
        'Warlock',
        'Monk',
        'Druid',
        'Demon Hunter',
    ];
    return classNames[classId - 1];
};

export default getClassString;
