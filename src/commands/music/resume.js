import musicMan from '../../features/music/musicModule';

export default {
    name: 'resume',
    description: 'Resumes any paused voice activity.',
    cooldown: 5,
    guildOnly: true,
    execute: async (message, args) => {
        musicMan.resume();
    },
};
