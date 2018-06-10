const prune = function pruneFunc(channel, args) {
    const amount = parseInt(args[0]);
    if (Number.isNaN(amount)) {
        return `${amount} is not a valid number`;
    }

    if (amount < 1 || amount > 50) {
        return `${amount} is not in valid range (1-50).`;
    }

    channel.bulkDelete(amount + 1, true).catch((err) => {
        console.error(err);
        return 'There was an error trying to prune messages.';
    });

    return '';
};

export default prune;
