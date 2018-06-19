import snekfetch from 'snekfetch';

module.exports = {
    name: 'cat',
    description: 'Eyebleach in meowtastic form.',
    cooldown: 5,
    execute(message, args) {
        // const uri = 'http://thecatapi.com/api/images/get?format=xml';
        // snekfetch.get(uri).then((res) => {
        //     console.log(res, res.body);
        //     message.channel.send(uri);
        // });
    },
};
