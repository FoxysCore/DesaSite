
export function getGuildDIv(guild, selectMethod) {
    const div = document.createElement("div");
    div.innerHTML = `<img src="" alt="Аватар" /><div class="server-avatar-fallback"></div>`
    div.querySelector("img").src = guild.getInfo().avatarUrl;
}