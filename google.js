let linksDictionary = {};

function parseAndLogLinks() {
  const linkElements = document.querySelectorAll('a[jsname="UWckNb"]');
  linkElements.forEach(linkElement => {
    const link = linkElement.getAttribute('href');
    if (!(link in linksDictionary)) {
      linksDictionary[link] = true;
      console.log(link);
    }
  });

  browser.storage.local.set({ links: Object.keys(linksDictionary) }, function() {
    console.log('Links saved to storage');
  });
}

const observer = new MutationObserver(parseAndLogLinks);
observer.observe(document.body, { childList: true, subtree: true });

window.addEventListener('scroll', () => {
  browser.runtime.sendMessage({ action: 'updateLinksCount' });
});
