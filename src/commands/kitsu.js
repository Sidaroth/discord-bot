import axios from 'axios';
import Discord from 'discord.js';
import trim from '../utils/trim';
import getRandomInt from '../utils/getRandomInt';
import { format } from 'url';

/**
 * Anime lookup using Kitsu's API.
 * https://kitsu.io/api/edge/anime?filter[genres]=adventure
 */

function formatSingleAnimeEmbed(data, id) {
    const runTime = `**Aired:** ${data.startDate} to ${data.endDate ? data.endDate : 'now'}`;
    const stats = [];
    stats.push(`**Rating:** ${data.averageRating}% approval`);
    stats.push(`**Type:** ${data.subtype}`);
    stats.push(`**Status:** ${data.status}`);
    stats.push(runTime);
    stats.push(`**Episodes:** ${data.episodeCount}`);
    if (data.episodeLength) stats.push(`**Length:** ${data.episodeCount * data.episodeLength} minutes.`);
    stats.push(`**Favorited by:** ${data.favoritesCount} users.`);
    stats.push(`**Listed by:** ${data.userCount} users.`);
    stats.push(`**Rating rank:** ${data.ratingRank}`);
    stats.push(`**Popularity rank:** ${data.popularityRank}`);
    stats.push(`**Age rating:** ${data.ageRating} - ${data.ageRatingGuide}`);
    stats.push(`**Nsfw:** ${data.nsfw ? 'Yep!' : 'Nope'}`);

    const embed = new Discord.RichEmbed()
        .setColor('#00AE86')
        .setTitle(data.titles.ja_jp)
        .setDescription(trim(`**${data.titles.en_jp}**\n${data.synopsis}`, 1024))
        .setURL(`https://kitsu.io/anime/${id}`)
        .setImage(data.posterImage.original)
        .addField('Stats', stats.join('\n'));
    return embed;
}

/**
 * Queries the API for the given anime title.
 */
function animeResponse(channel, args) {
    const title = args.join('%20').toLowerCase();
    const query = `https://kitsu.io/api/edge/anime?filter[text]=${title}`;

    axios
        .get(query)
        .then((resp) => {
            const bestMatch = resp.data.data[0];
            if (bestMatch) {
                const data = bestMatch.attributes;
                return channel.send(formatSingleAnimeEmbed(data, bestMatch.id));
            }
            return channel.send(`I'm afraid I couldn't find any anime related to ${args.join(' ')}`);
        })
        .catch(error => console.error(error));
}

/**
 * Queries the API for the highest available anime ID, then queries the API for information about a randomly generated id.
 */
function randomAnimeResponse(channel) {
    const query = 'https://kitsu.io/api/edge/anime';

    axios
        .get(query)
        .then((response) => {
            const { count } = response.data.meta;
            const animeId = getRandomInt(1, count);
            const animeQuery = `${query}/${animeId}`;
            axios
                .get(animeQuery)
                .then((resp) => {
                    const { attributes } = resp.data.data;
                    return channel.send(formatSingleAnimeEmbed(attributes, animeId));
                })
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

function genreResponse(channel, genre) {
    return undefined;
}

module.exports = {
    name: 'kitsu',
    description: 'Anime lookup by title, random anime, or a top 10 list based on the genre. Works by best match.',
    cooldown: 5,
    aliases: ['anime'],
    usage: 'genre [genre name].\n[anime title].\nno argument (random)',
    execute(message, args) {
        const comm = args[0];
        if (comm == null) {
            randomAnimeResponse(message.channel);
        } else if (comm === 'genre') {
            // get a top 10 list in the genre.
            const genre = args.shift();
            genreResponse(message.channel, genre);
        } else {
            animeResponse(message.channel, args);
        }
    },
};
