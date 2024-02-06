const dqs = (s) => document.querySelector(s);
const ael = (s, e, fn, z=false) => dqs(s).addEventListener(e, fn, z)
const config = {url: ''};

const injectNow = () => {
    const injectCode = {
        [config.url]:  {
            css:dqs('#css-box').value,
            js: dqs('#js-box').value,
            cssEnabled:dqs('#enable-css').checked,
            jsEnabled: dqs('#enable-js').checked,
        }
    }
    let globalCode = {
        globalCode: {
            cssGlobal:dqs('#css-box-global').value,
            jsGlobal: dqs('#js-box-global').value,
            cssGlobalEnabled:dqs('#enable-css-global').checked,
            jsGlobalEnabled: dqs('#enable-js-global').checked,    
        }
    }
    browser.storage.local.set(injectCode);
    browser.storage.local.set(globalCode);
    dqs('#success-msg').innerHTML =  "JS/CSS added. Refresh to see changes!"
}
dqs('#save-btn').addEventListener('click', injectNow)   

browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0];
    let url = tab.url.replace('https://', '').replace('http://', '').split('/')[0];
    config.url = url
    dqs("#url-div").innerHTML = url;

    function toggleView(a,b) {
        dqs('#local-scripts').style.display = a
        dqs('#global-scripts').style.display = b
    }
    ael('#show-local','click', (e)=>{toggleView('block', 'none')});
    ael('#show-global','click', (e)=>{toggleView('none', 'block')});


    let gettingItem = browser.storage.local.get(url);
    gettingItem.then( (res) => {
        dqs('textarea#css-box').value = (res[url]?.css) || "";
        dqs('textarea#js-box').value = (res[url]?.js) || "";
        dqs('#enable-css').checked = (res[url]?.cssEnabled) || "";
        dqs('#enable-js').checked = (res[url]?.jsEnabled) || "";
    }, (err) => {
        dqs('#success-msg').value = JSON.stringify(err);
    });

    // let gettingItemGlobal = browser.storage.local.get("globalCode");
    // gettingItemGlobal.then( (res) => {
    //     // dqs('#success-msg').innerText = JSON.stringify(res)
    //     dqs('textarea#css-box-global').value = (res.globalCode?.cssGlobal) || "";
    //     dqs('textarea#js-box-global').value = (res.globalCode?.jsGlobal) || "";
    //     dqs('#enable-css-global').checked = (res.globalCode?.cssGlobalEnabled) || "";
    //     dqs('#enable-js-global').checked = (res.globalCode?.jsGlobalEnabled) || "";
    // }, (err) => {
    //     dqs('#success-msg').value = JSON.stringify(err);
    // });ws

}, console.error);
