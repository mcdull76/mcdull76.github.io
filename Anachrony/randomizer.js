
/*
https://github.com/coolaj86/knuth-shuffle
https://bost.ocks.org/mike/shuffle/
*/
function shuffle(array) {
	let currentIndex = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}	

ENERGY_CORE = true;
ENERGY_CORE_EXHAUSTED = false;

class energyCoreBag {
	constructor( ec, ece ) {
		this.energyCoreCounter = ec;
		this.energyCoreExhaustedCounter = ece;
	}

	getShuffleArray() {
		const tempArray = [];

		for(let i = 0; i < this.energyCoreCounter.number; i++ ) {
			tempArray.push(ENERGY_CORE);
		}
		for(let i = 0; i < this.energyCoreExhaustedCounter.number; i++ ) {
			tempArray.push(ENERGY_CORE_EXHAUSTED);
		}

		return tempArray;
	}

	draw( amount ) {
		const shuffled = shuffle( this.getShuffleArray() );

		let ec_count = 0, ece_count = 0;
		for (let i = 0; i < shuffled.length && i < amount; ++i) {
		    if(shuffled[i]) {
		        ec_count++;
		    } else {
		    	ece_count++;
		    }
		}

		//remove drawed counter
		if( ec_count > 0 ) {
			this.energyCoreCounter.set( this.energyCoreCounter.number - ec_count );
		}
		if( ece_count > 0 ) {
			this.energyCoreExhaustedCounter.set( this.energyCoreExhaustedCounter.number - ece_count );
		}

		//return 1 drawn Exhausted Energy Core to the Energy Pool
		if( ece_count > 0 ) {
			this.energyCoreExhaustedCounter.increase(1);
		}

		return new Map([ [ENERGY_CORE,ec_count], [ENERGY_CORE_EXHAUSTED, ece_count] ]);
	}
}