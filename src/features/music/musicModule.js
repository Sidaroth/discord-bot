import YTDL from 'ytdl-core';

const musicModule = function musicModuleFunc() {
    const state = {};
    const queue = [];
    let dispatcher;
    let connection;
    let isPlaying = false;

    function playNext() {
        const song = queue.shift();
        if (!song || !connection) {
            isPlaying = false;
            if (dispatcher) dispatcher.pause();
            return;
        }

        console.log('Playing next song', song);
        const ytd = YTDL(song, { filter: 'audioonly' });

        isPlaying = true;
        dispatcher = connection.playStream(ytd);
        dispatcher.setVolume(0.5);

        dispatcher.on('end', () => console.trace('end of song!'));
        dispatcher.on('error', e => console.error(e));
    }

    function addToQueue(song) {
        queue.push(song);
    }

    function setConnection(con) {
        console.log('Audio connection established.');
        connection = con;
    }

    function disconnect() {
        console.log('Disconnecting from voice chat.');
        isPlaying = false;
        if (dispatcher) dispatcher.end();
        if (connection) connection.disconnect();
    }

    function setVolume(newVolume) {
        let volume = newVolume;
        if (volume < 0) volume = 0;
        if (volume > 100) volume = 100;
        if (dispatcher) dispatcher.setVolume(volume / 100);
    }

    function play() {
        if (!isPlaying) playNext();
    }

    function resume() {
        if (dispatcher) {
            dispatcher.resume();
        } else if (!isPlaying) {
            play();
        }
    }

    function pause() {
        if (dispatcher) dispatcher.pause();
    }

    function skip() {
        playNext();
    }

    Object.assign(state, {
        addToQueue,
        playNext,
        setConnection,
        disconnect,
        setVolume,
        skip,
        pause,
        resume,
        play,
    });

    return state;
};

const musicMan = musicModule();
export default musicMan;
