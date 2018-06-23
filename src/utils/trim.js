const trim = function trimFunc(str, max) {
    return str.length > max ? `${str.slice(0, max - 3)}...` : str;
};

export default trim;
