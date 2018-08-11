const trim = function trimFunc(inputStr, max, appendDots = true) {
    let str = inputStr.length > max ? `${inputStr.slice(0, max - 3)}` : inputStr;
    if (appendDots) {
        str = `${str}...`;
    }
    return str;
};

export default trim;
