document.addEventListener('DOMContentLoaded', () => {
  const saveLinksButton = document.getElementById('saveLinks');
  const totalLinksSpan = document.getElementById('totalLinks');

  // Function to update total links count
  function updateTotalLinksCount() {
    browser.storage.local.get('links', (data) => {
      const links = data.links || [];
      totalLinksSpan.textContent = links.length;
    });
  }

  // Update total links count when popup opens
  updateTotalLinksCount();

  // Save links button functionality
  saveLinksButton.addEventListener('click', () => {
    browser.storage.local.get('links', (data) => {
      const links = data.links || [];
      const file = new Blob([links.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'links.txt';
      link.click();
      URL.revokeObjectURL(url);
    });
  });

  // Update total links count when scrolling the page
  browser.tabs.executeScript({ code: 'window.addEventListener("scroll", () => { browser.runtime.sendMessage({ action: "updateLinksCount" }); });' });

  // Listen for messages from content script to update total links count
  browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateLinksCount') {
      updateTotalLinksCount();
    }
  });
});
