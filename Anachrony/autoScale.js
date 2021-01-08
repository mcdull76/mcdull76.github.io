let global_scaling = 1;
const defaultW = 1480+250;
const defaultH = 1080;

window.onresize = autoScale;

function updateScale( ) {
	const split = window.location.href.split("scale=");
	let scale = parseFloat(split[1]);


	const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

	if (split.length === 1) global_scaling = Math.min( vw/defaultW, vh/defaultH ); //Default

}

function autoScale() {
	updateScale();

	automa.width = defaultW * global_scaling;
	automa.height = defaultH * global_scaling;

	automa.renderer.resize(automa.width, automa.height);

    automa.stage.scale.x=global_scaling;
    automa.stage.scale.y=global_scaling;
}
