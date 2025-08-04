// === Tab Switching Logic ===
const tabs = document.querySelectorAll('.nav-buttons button');
const sections = document.querySelectorAll('.tab-section');

tabs.forEach(button => {
  button.addEventListener('click', () => {
    const selected = button.getAttribute('data-tab');
    sections.forEach(section => {
      section.classList.toggle('active', section.id === selected);
    });
    if (selected === 'nintendo') loadNintendoPresence();
  });
});

// === Discord Avatar and Status ===
const avatarImg = document.getElementById('discord-avatar');
const discordStatus = document.getElementById('discord-status');
const lanyardStatus = document.getElementById('lanyard-status');

fetch('https://api.lanyard.rest/v1/users/563697359423406082')
  .then(res => res.json())
  .then(data => {
    const d = data.data;
    if (d) {
      avatarImg.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
      const status = d.discord_status === 'online' ? 'Online' : 'Offline';
      discordStatus.textContent = status;
      discordStatus.className = `status ${d.discord_status}`;
      lanyardStatus.textContent = status;
      lanyardStatus.className = d.discord_status;
    }
  })
  .catch(() => {
    discordStatus.textContent = 'Offline';
    discordStatus.className = 'status offline';
  });

// === Nintendo Presence Loader ===
function loadNintendoPresence() {
  const out = document.getElementById('nintendo-output');
  fetch('https://nxapi-presence.fancy.org.uk/api/presence/03e0f77eb2a15cd9/events?include-splatoon3=1')
    .then(res => res.json())
    .then(data => {
      const latest = data?.events?.[0];
      if (latest) {
        out.innerHTML = `
          Most recent activity: ${latest.name}<br>
          Timestamp: ${new Date(latest.created_at).toLocaleString()}
        `;
      } else {
        out.textContent = 'No recent Nintendo activity found.';
      }
    })
    .catch(() => {
      out.textContent = 'Failed to load Nintendo data.';
    });
}
