const {
	util: { log },
	plugin: { store }
} = shelter;
const { Divider, Header, TextBox, Space, Button, LinkButton, HeaderTags, ButtonSizes } = shelter.ui;

store.url ??= "https://example.com/"
store.json ??= {"wasd": "wow"}

function sanitizeString(str){
    str = str.replaceAll("<","&lt;").replaceAll(">","&gt;")
    return str.trim();
}

function createPreview() {
	const preview = document.querySelector("#guhw_mru_preview")
	preview.innerHTML = ""
	Object.keys(store.json).forEach(k => {
		const v = store.json[k]

		preview.innerHTML += `<li><code><b>${sanitizeString(k)}</b> ${sanitizeString(v)}</code></li>`
	});
}

function updateFromURL() {
	fetch(store.url).then((v)=>{
		v.json().then((json)=>{
			store.json = json
		})
	})

	createPreview()
}

export const settings = () => (
	<div>
		<p style="margin-top: 0;">Replaces your sent messages with values from a URL. Made by <LinkButton href="https://guhw.dev">guhw</LinkButton>!</p>		
		<Divider mt mb></Divider>

		<Header tag={HeaderTags.EYEBROW}>json URL</Header>
		<TextBox value={store.url} onInput={(v)=>{store.url = v}}></TextBox>
		<Button size={ButtonSizes.MEDIUM} onClick={updateFromURL}>Update</Button>
		<Space></Space>
		<Divider mt mb></Divider>
	</div>
)

var unintercept
export function onLoad() {
	log("[MessageReplaceURL] loaded :3")
	unintercept = shelter.http.intercept("post", /\/channels\/\d+\/messages/,(orig,send)=>{
		try {

			Object.keys(store.json).forEach(k => {
				const v = store.json[k]
		
				if (orig.body.content == k) {
					orig.body.content = v
				}
			});
		} catch (error) {
			shelter.ui.showToast({
				title: "Message Replace URL Error",
				content: "report to devs please",
				duration: 5000
			})
			console.error("[MessageReplaceURL] uh oh",orig,error)
		}
		return send(orig)
	});
}

export function onUnload() {
	unintercept()
}
