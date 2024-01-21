const { Language } = require('node-nlp');

const language = new Language();

console.log(language.guess('✏️All-around Writer (Professional Version)'));
