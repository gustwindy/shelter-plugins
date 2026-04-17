const {
	solid: { onCleanup },
	util: { log },
	plugin: { store },
	flux: { stores }
} = shelter;
import css from "./style.css"

var mo = null;

function processGif(e) {
	const span = document.createElement("span")

	const l = e.querySelector("img")?.getAttribute("src").split("/")
	if (l) {
		const name = l[l.length-1].split("?")[0]

		span.innerText = name
		span.classList.add("guhw-wtn")

		e.append(span)
	}
}

const stupid_and_dumb_selector = ".result__2dc39:not(:has(.guhw-wtn)):has(img)"

function observeGifPicker(container) {
	mo?.disconnect();

	mo = new MutationObserver(mutations => {
		setTimeout(() => {
			container.querySelectorAll(stupid_and_dumb_selector).forEach(processGif);
		}, 20);
	});

	mo.observe(container, { childList: true, subtree: true });
	container.querySelectorAll(stupid_and_dumb_selector).forEach(processGif);
}

export function onLoad() {
	log("[whatsTheName] loaded :3")

	const TRIGGERS = ["GIF_PICKER_INITIALIZE", "GIF_PICKER_QUERY"];
	for (const t of TRIGGERS) shelter.plugin.scoped.flux.subscribe(t, ()=>{
		const unobserve = shelter.observeDom("#gif-picker-tab-panel", e => {
			console.log(e)
			unobserve();
			observeGifPicker(e);
		});
		setTimeout(unobserve, 500);
	});

	window.guhw_wtn_remove_css = shelter.ui.injectCss(css)
}


export function onUnload() {
	document.querySelectorAll(".guhw-wtn").forEach((e)=>e.remove());
	window.guhw_wtn_remove_css?.() // ive been doing it like this but im pretty sure it doesnt even have to be on the window
	mo?.disconnect();
}