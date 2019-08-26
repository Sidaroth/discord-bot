import YTDL from 'ytdl-core';

const musicModule = function musicModuleFunc() {
    const state = {};
    const queue = [];
    let dispatcher;
    let connection;
    let isPlaying = false;
    let volume = 0.5;

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
        dispatcher.setVolume(volume);

        dispatcher.on('end', () => {
            console.log('Song end');
            playNext();
        });
        dispatcher.on('error', e => console.error(e));
    }

    function queueCount() {
        return queue.length;
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
        if (Number.isNaN(newVolume)) return;

        volume = newVolume / 100;
        if (volume < 0) volume = 0;
        if (volume > 1) volume = 1;
        if (dispatcher) dispatcher.setVolume(volume);
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
        queueCount,
    });

    return state;
};

const musicMan = musicModule();
export default musicMan;
