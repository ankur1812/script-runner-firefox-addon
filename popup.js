const dqs = (s) => document.querySelector(s);
const config = {url: ''};

const injectNow = () => {
    const injectCode = {
        [config.url]:  {css:dqs('#css-box').value, js: dqs('#js-box').value}
    }
    browser.storage.local.set(injectCode);
    dqs('#success-msg').innerHTML =  "JS/CSS added. Refresh to see changes!"
}
dqs('button').addEventListener('click', injectNow)

browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0];
    let url = tab.url.replace('https://', '').replace('http://', '').split('/')[0];
    config.url = url
    dqs("#url-div").innerHTML = url;
    let gettingItem = browser.storage.local.get(url);
    gettingItem.then( (res) => {
        dqs('textarea#css-box').value = (res[url]?.css) || "";
        dqs('textarea#js-box').value = (res[url]?.js) || "";
    }, (err) => {
        dqs('#success-msg').value = JSON.stringify(err);
    });
}, console.error);
