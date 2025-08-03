const {
	util: { log },
	plugin: { store }
} = shelter;

var ws;
store.closed = true;
const disconnect = setInterval(() => {
	if (store.closed) {
		log("[shelterBetterKeybinds] connecting...")
		store.closed = false
		try {
			ws = new WebSocket("ws://localhost:8310");
			ws.onmessage = (event) => {
				document.querySelector(`[aria-label=\"${event.data}\"]`).click();
			}
			ws.onclose = () => {
				log('oh! goodbye!');
				shelter.ui.showToast({
					title: "Shelter Better Keybindings",
					content: "Unable to connect to keybindings server.",
				})
				store.closed = true;
			}
			ws.onopen = () => {
				shelter.ui.showToast({
					title: "Shelter Better Keybindings",
					content: "Connected.",
				})
			}
		} catch (error) {
			store.closed = true
			log(error)
		}
	}
}, 4000);

export function onLoad() {
	log("[shelterBetterKeybinds] loaded :3");
}

export function onUnload() {
	closed = true
	ws.close();
	clearInterval(disconnect)
}
