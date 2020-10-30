const formatNum = function formatNumFunc(num, locale = 'en-IN') {
    return new Intl.NumberFormat(locale).format(num);
};

export default formatNum;
