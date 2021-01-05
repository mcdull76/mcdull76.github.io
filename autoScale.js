let global_scaling = 1;

window.onresize = autoScale;

function autoScale( ) {
	const split = window.location.href.split("scale=");
	let scale = parseFloat(split[1]);

	const defaultW = 1480+250;
	const defaultH = 1080;

	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

	if (split.length === 1) global_scaling = Math.min( vw/defaultW, vh/defaultH ); //Default

}


