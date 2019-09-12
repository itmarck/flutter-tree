import map from "./map";
import { mapperSingleLine, mapperMultiLine } from "./mapper";
import { symbols, triggers } from "./constants";

function isAbbr(text: string): boolean {
    return !text.includes(symbols.enter);
}

export function expand(text: string): string {
    text = filter(text);
    return map(isAbbr(text) ? mapperSingleLine(text) : mapperMultiLine(text));
}

export function validate(text: string): boolean {
    return isAbbr(text) ? validateSingleLine(text) : validateMultiLine(text);
}

function validateSingleLine(abbr: string): boolean {

    let left = 0, right = 0;
    for (let i = 0; i < abbr.length; i++) {
        switch (abbr[i]) {
            case symbols.childrenBuilder:
                left++;
                break;
            case symbols.childrenEnd:
                right++;
                break;
            case symbols.childrenSeparator:
                if (left === 0) {
                    return false;
                }
                break;
            case symbols.childBuilder:
                break;
            default:
                if (abbr[i].match(/\W/i)) {
                    return false;
                }
                break;
        }
    }

    if (left !== right) {
        return false;
    }

    if (abbr === '' || abbr.match(/(>|\[|,){2}|>]|]\[|]>/g)) {
        return false;
    }

    return true;
}

function validateMultiLine(abbr: string): boolean {
    return true;
}

function filter(text: string): string {
    text = text.trim();
    if (text.includes(symbols.childrenBuilder)) {
        return limitAbbr(text);
    } else {
        return removeEndTriggers(text);
    }
}

function removeEndTriggers(text: string): string {
    text = text.replace(/\,\]/g, symbols.childrenEnd);
    return triggers.some(e => text.endsWith(e))
        ? removeEndTriggers(text.slice(0, -1))
        : text;
}

function limitAbbr(abbr: string): string {
    let text = '', block = 0, flag = false;
    let index = Array.from(abbr).findIndex((char, pos) => {
        text += char;
        switch (char) {
            case symbols.childrenBuilder:
                flag = true;
                block++;
                break;
            case symbols.childrenEnd:
                block--;
                break;
        }
        if (!block && flag) {
            return pos;
        }
    });
    return text.slice(0, index + 1);
}
