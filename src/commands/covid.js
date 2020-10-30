import axios from 'axios';
import formatNum from '../utils/formatNum';

export default {
    name: 'covid',
    description: 'Information about covid-19',
    aliases: ['corona'],
    usage: '<country or countrycode>',
    cooldown: 5,
    execute: async (message, args) => {
        const uri = 'https://api.covid19api.com/summary';

        try {
            const res = await axios.get(uri);

            const country = args[0] ? args[0].toLowerCase() : '';
            const { Global: global, Countries: countries } = res.data;

            let resp = '**Latest global covid-19 statistics:**';
            let dataSource = global;
            if (country) {
                const countryData = countries.find(c => c.Country.toLowerCase() === country || c.CountryCode.toLowerCase() === country || c.Slug.toLowerCase() === country);
                if (!countryData) {
                    message.channel.send(`No data could be found for country or countrycode ${country}.`);
                    return;
                }

                // We found country data, update response heading.
                dataSource = countryData;
                resp = `**Latest covid-19 statistics for ${countryData.Country}:**`;
            }

            const recoveryPct = (dataSource.TotalRecovered / dataSource.TotalConfirmed * 100).toFixed(2);
            const deathPct = (dataSource.TotalDeaths / dataSource.TotalConfirmed * 100).toFixed(2);
            resp = `${resp}\nTotal Confirmed Cases: *${formatNum(dataSource.TotalConfirmed)}*.`;
            resp = `${resp}\nTotal Recovered Cases: *${formatNum(dataSource.TotalRecovered)} (${recoveryPct}%)*.`;
            resp = `${resp}\nTotal Deaths: *${formatNum(dataSource.TotalDeaths)} (${deathPct}%)*.`;
            if (dataSource.Date) resp = `${resp}\n\n*Data last updated: ${dataSource.Date}.*`;

            message.channel.send(resp);
        } catch (err) {
            console.error(err);
        }
    },
};
