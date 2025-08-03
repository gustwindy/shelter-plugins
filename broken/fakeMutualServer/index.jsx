const {
	util: { log },
	plugin: { store }
} = shelter;
const { Space, Header, Divider, HeaderTags, TextBox, LinkButton } = shelter.ui;

store.userId ??= "0"
store.serverName ??= "I live a life so hollow that"
store.serverNick ??= "I'm not even there!"
store.iconUrl ??= "https://shelter.uwu.network/logo.svg"

export const settings = () => (
	<div>
		<p style="margin-top: 0;">These will only apply if you have at least one mutual server with the user. Made by <LinkButton href="https://guhw.dev">guhw</LinkButton>!</p>
		<Header tag={HeaderTags.EYEBROW}>User ID to apply to</Header>
		<TextBox value={store.userId} onInput={(v)=>{store.userId = v}}></TextBox>
		
		<Divider mt mb></Divider>

		<Header tag={HeaderTags.EYEBROW}>Server Name</Header>
		<TextBox value={store.serverName} onInput={(v)=>{store.serverName = v}}></TextBox>
		<Space></Space>

		<Header tag={HeaderTags.EYEBROW}>Server Nickname (only applies if the user's first mutual server has a nickname)</Header>
		<TextBox value={store.serverNick} onInput={(v)=>{store.serverNick = v}}></TextBox>
		<Space></Space>

		<Header tag={HeaderTags.EYEBROW} >Server Icon URL</Header>
		<TextBox value={store.iconUrl} onInput={(v)=>{store.iconUrl = v}}></TextBox>
	</div>
)

var modal_observation

function create_fake_server(reference) {
	const cloned = reference.cloneNode(true)
	
	const server_name = cloned.querySelector(".listName_d2d6cb")
	const guild_nick = cloned.querySelector(".guildNick_c5a773")
	const server_icon = cloned.querySelector(".icon_a64689")

	server_name.innerText = store.serverName
	if (guild_nick) {
		guild_nick.innerText = store.serverNick
	}
	server_icon.style = `background-image: url(\"${store.iconUrl}\");`
	
	reference.parentNode.appendChild(cloned)
}

export function onLoad() {
	log("loaded :3")
	shelter.plugin.scoped.flux.intercept(dispatch => {
		console.log(dispatch.type)
		if (dispatch.type == "USER_PROFILE_MODAL_OPEN") {//(!ignore.includes(dispatch.type)) {
			if (dispatch.userId == store.userId) {
				log("user profile open! :3")
				if (modal_observation) {
					modal_observation()
				}
				modal_observation = shelter.observeDom(".container_ecc04c:has([role=\"tablist\"])",(e)=>{
					const is_on_servers = e.querySelector("[data-tab-id=\"MUTUAL_GUILDS\"][aria-selected=\"true\"]")
					const servers = e.querySelector("[dir=\"ltr\"]:not(.fms_tampered)")

					const text = document.querySelector("[data-tab-id=\"MUTUAL_GUILDS\"] .defaultColor_a595eb:not(.fms_tampered)")
					if (text) {
						text.classList.add("fms_tampered")
						const split = text.innerText.split(" ")
						text.innerText = `${(split[0]*1)+1} Mutual Servers`
					}
					if (is_on_servers&&servers) {
						log("cool servers!")
						const first_server = servers.querySelector(".listRow_d2d6cb")
						if (first_server) {
							servers.classList.add("fms_tampered")
							
							create_fake_server(first_server)
						} else {
							log("no other servers to copy from...")
						}
					}
				})
			}
		}
	})
}

export function onUnload() {
	log("awh man...")
	if (modal_observation) {
		modal_observation()
	}
}
