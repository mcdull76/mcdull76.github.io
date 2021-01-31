/*
	multi language handling
*/

//import * as en from "./resources/en.js";
//import * as zh_TW from "./resources/zh_TW.js";

const languageFileIndex = {
	"en": 0,
	"zh_TW": 1
}

class Language {

	constructor( langFileURL ) {
//		this.json = json;
//		setLanguage( jsonFileURL );
		this.languageFile = [];
		this.languageFile.push( en );
		this.languageFile.push( {...en, ...zh_TW} );


		this.currentLangIndex = languageFileIndex["en"];
	}
/*
	async getLanguage( url ) {
		return await import( url ).then(module => module.default);			
	}
*/

	setLanguage( index ) {
		this.currentLangIndex = index;
	}
}

const language = new Language();


function getText( id, args = []) {
	let rv = id;

	if( language.languageFile[language.currentLangIndex][rv] === undefined ) {
		rv = rv.replace( /{[^\s{]+}/g,  function (match) { return getText(match.substring(1, match.length-1) ); } );
	} else {
		rv = getText( language.languageFile[language.currentLangIndex][rv], args );
	}

	for( let i = 0; i < args.length; i++ ) {
		rv = rv.replace( /%d/, args[i] );
	}

	return rv;
}

