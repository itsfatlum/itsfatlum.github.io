// === TAB SWITCHING ===
const tabs = document.querySelectorAll('.nav-buttons button');
const sections = document.querySelectorAll('.tab-section');

tabs.forEach(button => {
  button.addEventListener('click', () => {
    const selectedTab = button.getAttribute('data-tab');

    // Show only the selected tab
    sections.forEach(section => {
      section.classList.toggle('active', section.id === selectedTab);
    });

    // Load Nintendo data if selected
    if (selectedTab === 'nintendo') {
      loadNintendoPresence();
    }
  });
});

// === DISCORD STATUS & AVATAR (Lanyard) ===
fetch('https://api.lanyard.rest/v1/users/563697359423406082')
  .then(res => res.json())
  .then(data => {
    const d = data.data;
    const avatarImg = document.getElementById('discord-avatar');
    const discordStatus = document.getElementById('discord-status');
    const lanyardStatus = document.getElementById('lanyard-status');

    if (d) {
      const status = d.discord_status === 'online' ? 'Online' : 'Offline';
      avatarImg.src = `https://cdn.discordapp.com/avatars/${d.discord_user.id}/${d.discord_user.avatar}.png?size=128`;
      discordStatus.textContent = status;
      discordStatus.className = `status ${d.discord_status}`;
      lanyardStatus.textContent = status;
      lanyardStatus.className = d.discord_status;
    }
  })
  .catch(() => {
    const discordStatus = document.getElementById('discord-status');
    const lanyardStatus = document.getElementById('lanyard-status');
    discordStatus.textContent = 'Offline';
    lanyardStatus.textContent = 'Offline';
    discordStatus.className = 'status offline';
    lanyardStatus.className = 'offline';
  });

// === NINTENDO PRESENCE ===
function loadNintendoPresence() {
  const avatar = document.getElementById('nintendo-avatar');
  const statusText = document.getElementById('nintendo-status');

  fetch('https://nxapi-presence.fancy.org.uk/api/presence/03e0f77eb2a15cd9?include-splatoon3=1')
    .then(res => res.json())
    .then(data => {
      const profile = data.presence?.user;
      const online = data.presence?.online;
      const lastSeen = data.presence?.last_seen;

      if (profile) {
        avatar.src = profile.avatar_url || '';
      }

      if (online) {
        statusText.innerHTML = `<span style="color:#00ff88">Currently online on Nintendo Switch</span>`;
      } else if (lastSeen) {
        const ago = timeAgo(new Date(lastSeen));
        statusText.innerHTML = `
          <span style="color:#ff4e4e">Currently not online</span><br>
          Last seen: ${ago}
        `;
      } else {
        statusText.innerText = 'Status unknown.';
      }
    })
    .catch(() => {
      statusText.innerText = 'Failed to load Nintendo presence.';
    });
}

// === Convert timestamp to time ago ===
function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  return 'just now';
}
