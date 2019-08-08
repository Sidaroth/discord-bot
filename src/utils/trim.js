const trim = function trimFunc(inputStr, max, appendDots = true) {
    const needsTrim = inputStr.length > max;
    let str = needsTrim ? `${inputStr.slice(0, max - 3)}` : inputStr;
    if (appendDots && needsTrim) {
        str = `${str}...`;
    }
    return str;
};

export default trim;
