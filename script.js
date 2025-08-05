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
    .catch(err => {
      statusText.innerText = 'Failed to load Nintendo presence.';
    });
}

// Helper function to convert timestamp to relative time
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
