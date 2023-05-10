const colors = require('ansi-colors');
const progressBar = require('cli-progress');


const colorBar = new progressBar.Bar({
    format: colors.greenBright('{bar}') + ' {percentage}% | {value}/{total} | {duration_formatted} | {message}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
});

module.exports = colorBar;