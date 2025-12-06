const {
	util: { log },
	ui: { Button, ButtonLooks, openModal, ModalRoot,ModalHeader,ModalBody,Header,HeaderTags,ModalSizes,TextBox,ModalConfirmFooter,showToast }
} = shelter;

let users = []

function createButton(parent) {
	const button = <Button 
		look={ButtonLooks.FILLED}
		onclick={openPingAllModal}
		>Bulk Ping
	</Button>
	button.style.margin = "auto"
	button.style.marginTop = "10px"
	button.style.width = "max-content"
	button.classList.add("guhw-apa")

	parent.prepend(button)

	return button
}

function lookForParent(payload) {
	users = []
	const sel = ".members_c8ffbb:not(:has(.guhw-apa))"
	const exists = document.querySelector(sel)
	if (exists) {
		createButton(exists)
		return
	}

	const unobserve = shelter.observeDom(sel, e => {
		unobserve();
		createButton(e);
	});
	setTimeout(unobserve, 500);
}

function copyPingAll(pingSettings) {
	let cur_amount = 0
	let current = ""
	let lines = []

	users.forEach((u)=>{
		if (current.length >= pingSettings.maxLineLength||cur_amount >= pingSettings.maxPingsPerLine) {
			lines.push(current)
			cur_amount = 0
			current = ""
		}
		current += `<@${u}>`
		cur_amount += 1
	})
	console.log(users)
	lines.push(current)

	window.navigator.clipboard.writeText(lines.join("\n\n"))
	showToast({
		title: "Copied bulk ping",
		content: "Check your clipboard, paste anywhere."
	})
}

function openPingAllModal() {
	let pingSettings = {
		maxPingsPerLine: 99,
		maxLineLength: 1500,
	}

	openModal((p)=><ModalRoot size={ModalSizes.MEDIUM}>
		<ModalHeader close={p}>Bulk Ping</ModalHeader>
		<ModalBody>
			Plugin by @guhw.<br/>
			Each line should be its own message. Very unreliable in big servers, tablist needs to be fully loaded. (using a different way soon, maybe)<br/>
			UserIDs loaded: {users.length}

			<Header tag={HeaderTags.H4} style="margin-bottom: 0; margin-top: 10px;">Max Pings Per Line</Header>
			<TextBox value={pingSettings.maxPingsPerLine} placeholder={pingSettings.maxPingsPerLine} onInput={(v)=>{pingSettings.maxPingsPerLine = Number(v)}}></TextBox>
			<Header tag={HeaderTags.H4} style="margin-bottom: 0; margin-top: 10px;">Max Length Per Line</Header>
			<TextBox value={pingSettings.maxLineLength} placeholder={pingSettings.maxLineLength} onInput={(v)=>{pingSettings.maxLineLength = Number(v)}}></TextBox>

		</ModalBody>
		<ModalConfirmFooter onCancel={p.close} onConfirm={()=>{p.close(); copyPingAll(pingSettings)}} ></ModalConfirmFooter>
	</ModalRoot>)
}

const unobserve = shelter.observeDom(".member__5d473 .mask__44b0c .avatar__44b0c", e => {
	const id = e.src?.split("/avatars/")[1]?.split("/")[0]
	if (Number(id)&&!users.includes(id)) {
		users.push(id)
	}
});

export function onLoad() {
	log("[autoPingAll] loaded >:3")

	lookForParent()
	const TRIGGERS = ["CHANNEL_SELECT", "LOAD_MESSAGES_SUCCESS"];
	for (const t of TRIGGERS) shelter.plugin.scoped.flux.subscribe(t, lookForParent);
}

export function onUnload() {
	document.querySelectorAll(".guhw-apa").forEach(element => {
		element.remove()
	});
	unobserve();
}
