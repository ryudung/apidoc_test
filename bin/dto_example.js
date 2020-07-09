/**
 * Created by mo.o on 2017. 4. 28..
 */
function parse(content, source) {
    source = trim(source);

    var title = '';
    var text = '';
    var type;

    // Search for @dtoExample "[{type}] title and content
    // /^(@\w*)?\s?(?:(?:\{(.+?)\})\s*)?(.*)$/gm;
    var parseRegExpFirstLine = /(@\w*)?(?:(?:\s*\{\s*([a-zA-Z0-9\.\/\\\[\]_-]+)\s*\}\s*)?\s*(.*)?)?/;
    var parseRegExpFollowing = /(^.*\s?)/gm;

    var matches;
    if ((matches = parseRegExpFirstLine.exec(source))) {
        type = matches[2];
        title = matches[3];
    }

    parseRegExpFollowing.exec(content); // ignore line 1
    while ((matches = parseRegExpFollowing.exec(source))) {
        text += matches[1];
    }

    if (text.length === 0)
        return null;

    text = text.replace(/_@/gi, '@');
    text = text.replace(/\.\-\*\*/gi, '/**');
    text = text.replace(/\*\-\./gi, '*/');

    return {
        title: title,
        content: unindent(text),
        type: type || 'json'
    };
}


/**
 * Exports
 */
module.exports = {
    parse: parse,
    path: 'local.examples',
    method: 'push'
};

/*
 * Utils
 */
function unindent(str) {
    var lines = str.split('\n');

    var xs = lines.filter(function (x) {
        return /\S/.test(x);
    }).sort();

    if (xs.length === 0)
        return str;

    var a = xs[0];
    var b = xs[xs.length - 1];

    var maxLength = Math.min(a.length, b.length);

    var i = 0;
    while (i < maxLength &&
    /\s/.test(a.charAt(i)) &&
    a.charAt(i) === b.charAt(i)) {
        i += 1;
    }

    if (i === 0)
        return str;

    return lines.map(function (line) {
        return line.substr(i);
    }).join('\n');
};

function trim(str) {
    return str.replace(/^\s*|\s*$/g, '');
};