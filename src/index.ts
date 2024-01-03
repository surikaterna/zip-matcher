
import { ZipEntity } from "zip-parser/lib/parser";
import { RangeEntity } from "zip-parser/lib/parsers/range";
import { RegexpEntity } from "zip-parser/lib/parsers/regexp";
import { WildcardEntity } from "zip-parser/lib/parsers/wildcard";
import { ZipcodeEntity } from "zip-parser/lib/parsers/zipcode";
type ZipCode = string;

export
    const matchCode = (zip: string, entry: ZipcodeEntity) => entry.codes.indexOf(zip) !== -1;

const matchRange = (zip: string, entry: RangeEntity) => {
    const z = parseInt(zip);
    return z >= entry.from && z <= entry.to;
}

const matchRegexp = (zip: string, entry: RegexpEntity) => {
    for (let i = 0; i < entry.codes.length; i++) {
        const code = entry.codes[i];
        if (zip.match(new RegExp('^' + code.substr(1, code.length - 2) + '$'))) {
            return true;
        }
    }
    return false;
}

function globStringToRegex(str: string) {
    return new RegExp('^' + preg_quote(str).replace(/\\\*/g, '.*').replace(/\\\?/g, '.') + '$', 'g');
}
function preg_quote(str: string, delimiter?: string) {
    // http://kevin.vanzonneveld.net
    // +   original by: booeyOH
    // +   improved by: Ates Goral (http://magnetiq.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: preg_quote("$40");
    // *     returns 1: '\$40'
    // *     example 2: preg_quote("*RRRING* Hello?");
    // *     returns 2: '\*RRRING\* Hello\?'
    // *     example 3: preg_quote("\\.+*?[^]$(){}=!<>|:");
    // *     returns 3: '\\\.\+\*\?\[\^\]\$\(\)\{\}\=\!\<\>\|\:'
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}

const matchWildcard = (zip: ZipCode, entry: WildcardEntity) => {
    for (let i = 0; i < entry.codes.length; i++) {
        const code = entry.codes[i];
        if (zip.match(globStringToRegex(code))) {
            return true;
        }
    }
    return false;
}

type MatcherFunction = (zip: ZipCode, entry: any) => boolean

const matchers = {
    'code': matchCode,
    'regexp': matchRegexp,
    'range': matchRange,
    'wildcard': matchWildcard
}
const matchEntry = (zip: ZipCode, entry: ZipEntity) => {
    const matcher: MatcherFunction = matchers[entry.type];
    if (!matcher) {
        throw new Error('Unable to find matcher for code: ' + entry.type);
    }

    return matcher(zip, entry);
}

const match = (zip: ZipCode, entries: ZipEntity[]) => {
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (matchEntry(zip, entry)) {
            return true;
        }
    }
    return false;
}

export default match;
