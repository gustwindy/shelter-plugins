const {
	solid: { onCleanup },
	util: { log },
	plugin: { store },
	flux: { stores }
} = shelter;
const { Divider, Header, TextBox, Space, Button, LinkButton, HeaderTags, ButtonSizes } = shelter.ui;

import css from "./style.css"

var last_shown = []
var currentTextbox = null
var keyupHandler = null
var lastKeyup = 0

store.url ??= "https://example.com/"
store.json ??= {}

function updateFromURL() {
	fetch(store.url).then((v)=>{
		v.json().then((json)=>{
			store.json = json
		})
	})
	console.log(store.json)
}

export const settings = () => (
	<div>
		<p style="margin-top: 0;">Personal plugin. Put a JSON. Made by <LinkButton href="https://guhw.dev">guhw</LinkButton>!</p>		
		<Divider mt mb></Divider>

		<Header tag={HeaderTags.EYEBROW}>json URL</Header>
		<TextBox value={store.url} onInput={(v)=>{store.url = v}}></TextBox>
		<Button size={ButtonSizes.MEDIUM} onClick={updateFromURL}>Update</Button>
		<Space></Space>
		<Divider mt mb></Divider>
	</div>
)

function queryIn(text, n = 10) {
    const words = text.trim().split(/\s+/)
    const lastWord = words[words.length - 1].toLowerCase()
    const lower = text.toLowerCase()
    const scores = {}

    for (const [emoji, tags] of Object.entries(store.json)) {
        let score = 0
        for (const [tag, tagScore] of Object.entries(tags)) {
            if (tag === lastWord) score += tagScore * 2
            else if (words.some(w => w.toLowerCase() === tag)) score += tagScore
            else if (tag.includes(" ") && lower.includes(tag)) score += tagScore
        }
        if (score > 0) scores[emoji] = score
    }

    return Object.entries(scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(([emoji]) => emoji)
}

function displayNow(text) {
	const emojis = queryIn(text,7)
	if (emojis.length == 0) return

	const display = getDisplay()
	var final = ""

	last_shown = emojis
	emojis.forEach((e)=>{
		final = final + `<span style="background-image: url(https://cdn.discordapp.com/emojis/${e.split(":")[2].split(">")[0]}.png?size=56)"></span>`
	})

	display.innerHTML = final
}

function getDisplay() {
	let container = document.querySelector(".guhw-uwu")
	if (!container) {
		const parent = document.querySelector('.channelTextArea_f75fb0')
		if (!parent) return null
		container = document.createElement("div")
		container.classList.add("guhw-uwu")
		parent.appendChild(container)
	}
	return container
}

function capture() {
	const textbox = document.querySelector('.channelTextArea_f75fb0 [role="textbox"]')
	if (!textbox || textbox === currentTextbox) return

	if (currentTextbox && keyupHandler) {
		currentTextbox.removeEventListener("keyup", keyupHandler)
	}

	currentTextbox = textbox
	keyupHandler = () => {
		const now = Date.now()
		if (now - lastKeyup < 250) return
		lastKeyup = now
		displayNow(currentTextbox.textContent)
	}
	
	currentTextbox.addEventListener("keyup", keyupHandler)
}

function init() {
	getDisplay()
	capture()
}

const callback = (e)=>{
	if (e.altKey) {
		const num = Number.parseInt(e.key)-1

		if (num < last_shown.length && num > -1) {
			const event = new InputEvent("beforeinput", {
				bubbles: true,
				cancelable: true,
				inputType: "insertText",
				data: last_shown[num]
			})
			getDisplay().parentElement.querySelector('[role="textbox"]').dispatchEvent(event)
			shelter.ui.showToast({
				title: last_shown[num],
				content: "put",
				duration: 2000
			})
		}
	}
}


export function onLoad() {
	log("[taggedEmojis] loaded :3")

	init()
	onCleanup(()=>{
		init()
	})

	const TRIGGERS = ["CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS"];
	for (const t of TRIGGERS) shelter.plugin.scoped.flux.subscribe(t, ()=>{
		const unobserve = shelter.observeDom(".channelTextArea_f75fb0:not(:has(.guhw-uwu))", e => {
			unobserve();
			init();
		});
		setTimeout(unobserve, 500);
	});

	window.guhw_uwu_remove_css = shelter.ui.injectCss(css)
	window.addEventListener("keydown",callback)
}

export function onUnload() {
	if (currentTextbox && keyupHandler) {
		currentTextbox.removeEventListener("keyup", keyupHandler)
	}
	document.querySelector(".guhw-uwu")?.remove()
	window.guhw_uwu_remove_css?.()
	window.removeEventListener("keydown", callback)
}