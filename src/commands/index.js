import apexmap from './apexmap';
import armory from './armory';
import avatar from './avatar';
import drop from './drop';
import fizzbuzz from './fizzbuzz';
import hi from './hi';
import hours from './hours';
import kitsu from './kitsu';
import trivia from './trivia';
import urban from './urban';
import xkcd from './xkcd';
import nasa from './nasa';
import iss from './iss';

import cat from './memes/cat';
import dog from './memes/dog';
import fox from './memes/fox';
import racist from './memes/racist';
import sweeney from './memes/sweeney';
import citation from './memes/citation';
import triggered from './memes/triggered';
import dadjoke from './memes/dadjoke';
import lifeadvice from './memes/lifeadvice';
import insult from './memes/insult';

import help from './server/help';
import leaveRole from './server/leaverole';
import prune from './server/prune';
import rank from './server/rank';
import admin from './server/admin';
import stats from './server/stats';
import usage from './server/usage';
import role from './server/role';

import disconnect from './music/disconnect';
import summon from './music/summon';
import queue from './music/queue';
import volume from './music/volume';
import skip from './music/skip';
import pause from './music/pause';
import resume from './music/resume';
import play from './music/play';
import music from './music/music';

// TODO This can probably be automated...
const commands = [
    // Generic commands
    apexmap,
    armory,
    avatar,
    drop,
    fizzbuzz,
    hi,
    hours,
    kitsu,
    trivia,
    urban,
    xkcd,
    nasa,
    iss,

    // Memes
    cat,
    citation,
    dadjoke,
    dog,
    fox,
    lifeadvice,
    racist,
    sweeney,
    triggered,
    insult,

    // Server management / Bot statistics and help
    help,
    rank,
    stats,
    usage,
    admin,
    leaveRole,
    role,
    prune,

    // music
    disconnect,
    summon,
    queue,
    volume,
    skip,
    pause,
    resume,
    play,
    music,
];

export default commands;
