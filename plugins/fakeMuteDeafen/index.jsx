const {
	solid: { onCleanup },
	util: { log },
	plugin: { store },
	flux: { stores }
} = shelter;
import css from "./style.css"

function createButton() {
	const parent = document.querySelector('[aria-label="Set Status"] ~ :has([aria-label="Deafen"]):has([aria-label="Mute"]):not(:has(.guhw-fmd))')
	if (parent) {
		var button = parent.querySelector("button[aria-label=\"Deafen\"]").cloneNode(true)
		parent.prepend(button)
		button.classList.add("guhw-fmd")
		button.childNodes[0].setAttribute("aria-label","Lock Voice State")
		button.querySelector("svg").innerHTML = `<path fill="currentColor" fill-rule="evenodd" d="M6 9h1V6a5 5 0 0 1 10 0v3h1a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Zm9-3v3H9V6a3 3 0 1 1 6 0Zm-1 8a2 2 0 0 1-1 1.73V18a1 1 0 1 1-2 0v-2.27A2 2 0 1 1 14 14Z" clip-rule="evenodd" class=""></path>`
		button.addEventListener("click",window.fakeDeaf)
	}
	return document.querySelector("button.guhw-fmd")
}

var unpatch_deaf
var unpatch_mute
var enabled = false
var button = false
export function onLoad() {
	log("[fakeMuteDeafen] loaded >:3")
	window.fakeDeaf = ()=>{
		enabled = !enabled
		if (enabled) {
			shelter.ui.showToast({
				title: "Fake Mute-Deafen",
				content: "Locked current voice state. Clicking Mute/Deaf will unmute/undeafen you, but it wont update the icons anywhere."
			})
			
			store.deafened = stores.MediaEngineStore.isSelfDeaf()
			store.muted = stores.MediaEngineStore.isSelfMute()
			store.active = true
		} else {
			shelter.ui.showToast({
				title: "Fake Mute-Deafen",
				content: "Unlocked current voice state."
			})
			store.active = false
		}
		button.classList.toggle("guhw-fmd-activated",enabled)
	}

	unpatch_deaf = shelter.patcher.after("isSelfDeaf",stores.MediaEngineStore,(args,ret)=>{
		if (store.active) {
			return store.deafened
		}
		return ret
	})
	unpatch_mute = shelter.patcher.after("isSelfMute",stores.MediaEngineStore,(args,ret)=>{
		if (store.active) {
			return store.mute
		}
		return ret
	})

	button = createButton()
	onCleanup(()=>{
		button = createButton()
	})

	const TRIGGERS = ["CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS"];
	for (const t of TRIGGERS) shelter.plugin.scoped.flux.subscribe(t, ()=>{
		button = createButton()
	});
	window.fmd_remove_css = shelter.ui.injectCss(css)
}

export function onUnload() {
	document.querySelectorAll(".guhw-fmd").forEach(element => {
		element.remove()
		console.log(element)
	});
	unpatch_deaf()
	unpatch_mute()
	window.fmd_remove_css()
}
