let linkSet = new Set();
let scrapingEnabled = false;

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'addLink' && scrapingEnabled) {
    const link = message.link;
    if (!linkSet.has(link)) {
      linkSet.add(link);
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false });
    }
  } else if (message.action === 'getAllLinks') {
    sendResponse({ links: Array.from(linkSet) });
  } else if (message.action === 'startScraping') {
    scrapingEnabled = true;
    sendResponse({ success: true });
  } else if (message.action === 'stopScraping') {
    scrapingEnabled = false;
    sendResponse({ success: true });
  } else if (message.action === 'resetLinks') {
    linkSet.clear();
    sendResponse({ success: true });
  } else if (message.action === 'getScrapingStatus') {
    sendResponse({ scrapingEnabled });
  } else {
    sendResponse({ success: false, error: 'Unknown action' });
  }
  return true;
  }
)