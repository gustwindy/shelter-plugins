const {
	util: { log },
	plugin: { store }
} = shelter;

const emoji_regex = /(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])|(<a?:\w+:\d+>)|:3/gm;
var unintercept
var messages_since_wtv = 0
var THRESHOLD = 12
var WARN_THRESHOLD_DIFFERENCE = 2
export function onLoad() {
	log("[Silliness] loaded :3")
	unintercept = shelter.http.intercept("post", /\/channels\/\d+\/messages/,(orig,send)=>{
		try {
			const has_emoji = emoji_regex.exec(orig.body.content) != null
			messages_since_wtv += 1
			if (has_emoji) {
				messages_since_wtv = 0
				if (messages_since_wtv >= THRESHOLD-WARN_THRESHOLD_DIFFERENCE) {
					shelter.ui.showToast({
						title: "saved",
						content: "u wont explode",
						duration: 1000
					})
				}
			}
			if (messages_since_wtv == THRESHOLD-WARN_THRESHOLD_DIFFERENCE) {
				shelter.ui.showToast({
					title: "you are ABOUT to explode btw",
					content: "do something about it",
					duration: 2500
				})
			}
			if (messages_since_wtv > THRESHOLD) {
				orig.body.content = orig.body.content + " im stupid and SUPER GAY"
			}
		} catch (error) {
			shelter.ui.showToast({
				title: "error",
				content: "grr",
				duration: 5000
			})
			console.error("[Silliness] uh oh",orig,error)
		}
		return send(orig)
	});
	init()
}

export function onUnload() {
	unintercept()
}
