const {
	util: { log },
	plugin: { store }
} = shelter;
const { Space, Header, Divider, HeaderTags, TextBox, LinkButton } = shelter.ui;

store.greeting ??= "o/"

export const settings = () => (
	<div>
		<p style="margin-top: 0;">Changes the sticker greetings with your own text. Made by <LinkButton href="https://guhw.dev">guhw</LinkButton>!</p>
		
		<Divider mt mb></Divider>

		<Header tag={HeaderTags.EYEBROW}>Greeting Text</Header>
		<TextBox value={store.greeting} onInput={(v)=>{store.greeting = v}}></TextBox>
	</div>
)
var unintercept

export function onLoad() {
	log("loaded :3")

	unintercept = shelter.http.intercept("post", /\/channels\/\d+\/greet/,(orig,send)=>{
		try {
			var ref = orig.body.message_reference
			shelter.http.post({
				body: {
					content: store.greeting,
					flags: 0,
					message_reference: {
						channel_id: ref.channel_id,
						message_id: ref.message_id
					},
					tts: false
				},
				url: `/channels/${ref.channel_id}/messages`
			})
		} catch (error) {
			shelter.ui.showToast({
				title: "Custom Greet Message Error",
				content: "report to devs please",
				duration: 5000
			})
			console.error("[CustomGreetMessage] uh oh",orig,error)
		}
		return ()=>{}
	});
}

export function onUnload() {
	unintercept()
	log("awh man...")
}
