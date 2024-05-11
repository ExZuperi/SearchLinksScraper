let linkSet = new Set();
let scrapingEnabled = false;
let mutationObserver;

function parseAndLogLinks() {
  const linkElements = document.querySelectorAll('a[class="tilk"]');
  linkElements.forEach(linkElement => {
    const link = linkElement.getAttribute('href');
    if (!linkSet.has(link)) {
      linkSet.add(link);
      chrome.runtime.sendMessage({ action: 'addLink', link: link }, (response) => {});
    }
  });
}

function startMutationObserver() {
  mutationObserver = new MutationObserver(parseAndLogLinks);
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

function cleanupMutationObserver() {
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }
}

chrome.runtime.sendMessage({ action: 'getScrapingStatus' }, (response) => {
  scrapingEnabled = response.scrapingEnabled;
  if (scrapingEnabled) {
    startMutationObserver();
  }
});

window.addEventListener('scroll', () => {
  chrome.runtime.sendMessage({ action: 'updateLinksCount' });
});