import axios from 'axios';
import { MessageAttachment } from 'discord.js';
import secrets from '../../secrets.json';

export default {
    name: 'iss',
    description: 'Provides data about the international space station.',
    cooldown: 5,
    guildOnly: false,
    requiresArgs: false,
    execute: async (message, args) => {
        try {
            const astros = await axios.get('http://api.open-notify.org/astros.json');
            const issData = await axios.get('http://api.open-notify.org/iss-now.json');

            // We can't just use .length here because sometimes the names are unknown, but the number is known.
            const people = astros.data.people;
            const numberOfPeople = astros.data.number;
            const issPos = issData.data.iss_position;

            const mapQuestUri = `http://www.mapquestapi.com/geocoding/v1/reverse?key=${secrets.mapquestAPIKey}&location=${issPos.latitude},${issPos.longitude}`;
            const locationData = await axios.get(mapQuestUri);

            const location = locationData.data.results[0].locations[0];
            const countryCode = location.adminArea1 ?? '';

            let resp = `The ISS is currently at coordinates (${issPos.latitude}*, *${issPos.longitude}*):`;
            if (countryCode === 'XZ') {
                resp = `${resp} Which is over International Waters (XZ).`;
            } else {
                const countryData = await axios.get(`https://restcountries.eu/rest/v2/alpha/${countryCode}`);
                resp = `${resp}\n**Country:** ${countryData.data.name} (${countryCode})/${countryData.data.nativeName} - ${countryData.data.region}`;
                resp = `${resp}\n**Population:** ${countryData.data.population}`;
            }

            resp = `${resp}\n\nThere are currently ${numberOfPeople} humans in space. They are:`;
            people.forEach((human) => {
                resp = `${resp}\n**${human.name}** - Currently aboard the ${human.craft}.`;
            });

            message.channel.send(resp);
        } catch {
            return;
        }
    },
};
