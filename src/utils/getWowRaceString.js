const getWowRaceString = function getWowRaceStringFunc(raceId) {
    switch (raceId) {
        case 1:
            return 'Human';
        case 2:
            return 'Orc';
        case 3:
            return 'Dwarf';
        case 4:
            return 'Night Elf';
        case 5:
            return 'Undead';
        case 6:
            return 'Tauren';
        case 7:
            return 'Gnome';
        case 8:
            return 'Troll';
        case 9:
            return 'Goblin';
        case 10:
            return 'Blood Elf';
        case 11:
            return 'Draenei';
        case 22:
            return 'Worgen';
        case 24:
            return 'Pandaren';
        case 25:
            return 'Pandaren';
        case 26:
            return 'Pandaren';
        case 27:
            return 'Nightborne';
        case 28:
            return 'Highmountain Tauren';
        case 29:
            return 'Void Elf';
        case 30:
            return 'Lightforged Draenei';
        case 34:
            return 'Dark Iron Dwarf';
        case 36:
            return "Mag'har Orc";
    }
    return '';
};

export default getWowRaceString;
