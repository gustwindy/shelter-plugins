const url = "https://api.github.com/repos/gustwindy/shelter-plugins/contents/plugins"

function getPluginList(callback) {
    if (!sessionStorage.getItem("last_fetch")) {
        sessionStorage.setItem("last_fetch",0)
    }
    if (Date.now()-sessionStorage.getItem("last_fetch") > 30*1000) {
        sessionStorage.setItem("last_fetch",Date.now())

        fetch(url).then((v)=>{
            v.json().then((plugins)=>{
                sessionStorage.setItem("plugins",JSON.stringify(plugins))
                callback()
            })
        })
    } else {
        callback()
    }
}

getPluginList(()=>{
    const plugins = JSON.parse(sessionStorage.getItem("plugins"))
    plugins.forEach(plugin => {
        const name = plugin.name

        fetch("/" + name + "/plugin.json").then((v)=>{
            v.json().then((json)=>{
                document.querySelector(".list").innerHTML += `<div class="plugin_info fadein"><a href="/${name}/" class="name">${json.name}</a><span class="desc">${json.description}</span></div><br>`
            })
        })
    });
})