const {
	util: { log },
	ui: { showToast }
} = shelter;

const limit = 128
const longest = "　"
function conversion(lines) {
	var total = 0
	lines.forEach((e)=>{
		total += e.length
	})
	newlines = Math.max(total-1,1)

	remaining = limit - total
	if (remaining < 0) {
		showToast({
			title: "Status New Lines",
			content: "There isn't enough space to put newlines."
		})
		return false
	}
	const per_gap = Math.floor((remaining / newlines) -1)

	const filler = (longest.repeat(per_gap)) + "\n"
	return lines.join(filler)
}

export function onLoad() {
	log("[statusNewlines] loaded >:3")

	shelter.plugin.scoped.observeDom(':not(:has(.guhw-snl)) > [for="custom-status-input"]',(label)=>{
		const parent = label.parentElement
		const textarea = label.parentElement.querySelector("#custom-status-input")

		const extra = label.cloneNode()
		extra.classList.add("guhw-snl")
		extra.innerText = " ('\\\\' will be replaced with a new line)"
		label.append(extra)
		//label.innerHTML = "Status ( will be replaced with a newline)"
	})
}

export function onUnload() {
	document.querySelectorAll(".guhw-snl").forEach(element => {
		element.remove()
	});
}
