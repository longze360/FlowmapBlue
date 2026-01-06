export default function sendEvent(key: string, title: string) {
  // Use .catch() to silently handle network errors from analytics
  fetch('https://flowmap-blue-stats.netlify.app/api/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key,
      title,
      href: typeof document !== 'undefined' ? document.location.href : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    }),
  }).catch(() => {
    // Silently ignore analytics errors - don't break user experience
  });
}
