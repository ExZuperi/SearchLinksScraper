document.addEventListener('DOMContentLoaded', () => {
  const startScrapperButton = document.getElementById('startScrapper');
  const stopScrapperButton = document.getElementById('stopScrapper');
  const resetLinksButton = document.getElementById('resetLinks');
  const saveLinksButton = document.getElementById('saveLinks');
  const totalLinksSpan = document.getElementById('totalLinks');

  updateTotalLinksCount();

  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'updateLinksCount') {
      updateTotalLinksCount();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: 'Unknown action' });
    }
  });

  browser.runtime.sendMessage({ action: 'getScrapingStatus' }, (response) => {
    updateScrapingStatus(response.scrapingEnabled);
  });

  startScrapperButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'startScraping' }, (response) => {
      if (response.success) {
        updateScrapingStatus(true);
      }
    });
  });

  stopScrapperButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'stopScraping' }, (response) => {
      if (response.success) {
        updateScrapingStatus(false);
      }
    });
  });

  resetLinksButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'resetLinks' }, (response) => {
      if (response.success) {
        updateTotalLinksCount();
      }
    });
  });

  saveLinksButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'getAllLinks' }, (response) => {
      const links = response.links;
      const file = new Blob([links.join('\n')], { type: 'text/plain' });
      const url = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'links.txt';
      link.click();
      URL.revokeObjectURL(url);
    });
  });

  function updateScrapingStatus(status) {
    startScrapperButton.disabled = status;
    stopScrapperButton.disabled = !status;
  }
  
  function updateTotalLinksCount() {
    browser.runtime.sendMessage({ action: 'getAllLinks' }, (response) => {
      const links = response.links;
      totalLinksSpan.textContent = links.length;
    });
  }
});
