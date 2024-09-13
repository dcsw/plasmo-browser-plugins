let isOpen = false;

chrome.action.onClicked.addListener((tab) => {
    if (isOpen) {
        chrome.sidePanel.setOptions({ enabled: false });
        isOpen = false;
    } else {
        chrome.sidePanel.setOptions({ enabled: true });
        chrome.sidePanel.open({ tabId: tab.id });
        isOpen = true;
    }
});