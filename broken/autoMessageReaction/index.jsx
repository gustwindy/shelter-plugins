const {
	util: { log },
	plugin: { store }
} = shelter;
const { Divider, Header, TextBox, Space, LinkButton, HeaderTags } = shelter.ui;

store.channelId ??= "0"
store.emojis ??= "🇵🇭"

export const settings = () => (
	<div>
		<p style="margin-top: 0;">Reacts to every message sent in a channel via API. Made by <LinkButton href="https://guhw.dev">guhw</LinkButton>!</p>
		
		<Divider mt mb></Divider>

		<Header tag={HeaderTags.EYEBROW}>Channel ID</Header>
		<TextBox value={store.channelId} onInput={(v)=>{store.channelId = v}}></TextBox>
		<Space></Space>

		<Header tag={HeaderTags.EYEBROW}>Reaction Emojis (Seperate by space for multiple)</Header>
		<TextBox value={store.emojis} onInput={(v)=>{store.emojis = v}}></TextBox>
	</div>
)

export function onLoad() {
	log("[AutoMessageReactions] loaded :3")
	shelter.plugin.scoped.flux.intercept(dispatch => {
		if (dispatch.type == "MESSAGE_CREATE" && dispatch.channelId == store.channelId && !dispatch.optimistic) {
			let i = 0
			store.emojis.split(" ").forEach(element => {
				console.log(element)
				setTimeout(()=>{
					shelter.http.put(`/channels/${dispatch.channelId}/messages/${dispatch.message.id}/reactions/${encodeURIComponent(element)}/%40me?location=Message%20Inline%20Button&type=0`)
					console.log("!")
				},(i*500)+(1000*(Math.random()*Math.random())))
				i = i + 1
			});
		}
	})
}

export function onUnload() {

}
