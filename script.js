// SPA routing system
const routes = {
  "/": () => {
    document.getElementById("route-content").innerHTML = `
      <h2>About Me</h2>
      <p>Hello! I'm Fatlum. Welcome to my personal site. 🧃</p>
      <p id="presence-status">Currently <span>...</span></p>
      <h3>Games I play:</h3>
      <ul>
        <li>Animal Crossing: New Horizons</li>
        <li>Splatoon 3</li>
        <li>Minecraft</li>
        <li>Mario Kart 8 Deluxe</li>
        <li>Among Us</li>
      </ul>
    `;
    updatePresenceStatus(); // Re-check when loading About Me
  },
  "/socials": () => {
    document.getElementById("route-content").innerHTML = `
      <h2>Socials</h2>
      <ul>
        <li>Instagram: <a href="https://instagram.com/itsf.atlum" target="_blank">@itsf.atlum</a></li>
        <li>Bluesky: <a href="https://itsfatlum.github.io" target="_blank">itsfatlum.github.io</a></li>
      </ul>
    `;
  },
  "/nintendo": () => {
    fetch("https://nxapi-presence.fancy.org.uk/api/presence/03e0f77eb2a15cd9/events?include-splatoon3=1")
      .then(res => res.json())
      .then(data => {
        const list = data.events.map(ev => `<li>${ev.title}</li>`).join("");
        document.getElementById("route-content").innerHTML = `
          <h2>Nintendo Presence</h2>
          <ul>${list}</ul>
        `;
      })
      .catch(() => {
        document.getElementById("route-content").innerHTML = "<p>Couldn't load Nintendo data.</p>";
      });
  },
  "/tab4": () => {
    document.getElementById("route-content").innerHTML = `<h2>Tab 4</h2><p>Coming soon!</p>`;
  },
  "/tab5": () => {
    document.getElementById("route-content").innerHTML = `<h2>Tab 5</h2><p>Coming soon!</p>`;
  },
  "/tab6": () => {
    document.getElementById("route-content").innerHTML = `<h2>Tab 6</h2><p>Coming soon!</p>`;
  },
};

// Navigation handling
document.querySelectorAll("button[data-route]").forEach(btn => {
  btn.addEventListener("click", () => {
    const route = btn.getAttribute("data-route");
    history.pushState({}, "", route);
    routes[route]?.();
  });
});

// Load route on page load or back/forward navigation
window.addEventListener("popstate", () => {
  routes[location.pathname]?.();
});

// Load the current route
routes[location.pathname] ? routes[location.pathname]() : routes["/"]();

// Discord presence (Lanyard API)
function updatePresenceStatus() {
  fetch("https://api.lanyard.rest/v1/users/563697359423406082")
    .then(res => res.json())
    .then(data => {
      const user = data.data.discord_user;
      const avatarURL = user.avatar.startsWith("a_")
        ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.gif`
        : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
      document.getElementById("discord-avatar").src = avatarURL;

      const presence = data.data.discord_status;
      const presenceText = presence === "online" ? 
        '<span class="online">online</span>' : 
        '<span class="offline">offline</span>';
      
      const statusElement = document.getElementById("presence-status");
      if (statusElement) {
        statusElement.innerHTML = `Currently ${presenceText}`;
      }

      const statusBox = document.getElementById("discord-status");
      if (statusBox) {
        let liveStatus = presence.charAt(0).toUpperCase() + presence.slice(1);
        const activity = data.data.activities?.find(a => a.type === 0);
        if (activity) {
          liveStatus += ` — Playing ${activity.name}`;
        }
        statusBox.textContent = liveStatus;
      }
    });
}
