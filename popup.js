const config = {url: ''};

const toggleAccordion = (containerDivClass) => {
    let isHidden = dqs(`.${containerDivClass} textarea`)?.classList.contains('hidden');
    dqs(`.${containerDivClass} textarea`)?.classList.toggle('hidden');
    if (dqs(`.${containerDivClass} .chevron`)) {
        dqs(`.${containerDivClass} .chevron`).classList.toggle('collapsed', !isHidden)
    }

    dqsA('#local-scripts textarea').forEach( ta => {
        let parentClass = ta.parentElement.className
        let currentDiv = parentClass == containerDivClass;
        if(!currentDiv){
            ta.classList.toggle('hidden', true)
            dqs(`.${parentClass} .chevron`)?.classList.toggle('collapsed', true)
        }
    });
}

const toggleView = (a,b) => {
    dqs('#local-scripts').style.display = a
    dqs('#global-scripts').style.display = b
    dqs('#show-local').classList.toggle('active', a == 'block')
    dqs('#show-global').classList.toggle('active', b == 'block')
}

const injectNow = () => {
    const injectCode = {
        [config.url]:  {
            css:dqs('#css-box').value,
            js: dqs('#js-box').value,
            cssEnabled:dqs('#enable-css').checked,
            jsEnabled: dqs('#enable-js').checked,
            globalScripts: dqsA('#global-scripts input')?.filter( i => i.checked)?.map(i => i.id)// || ['global_script_opacity']
        }
    }

    browser.storage.local.set(injectCode);
    // browser.storage.local.set(globalCode);

    dqsA('#local-scripts textarea').forEach( ta => {
        let parentClass = ta.parentElement.className
        ta.classList.toggle('hidden', true)
        dqs(`.${parentClass} .chevron`)?.classList.toggle('collapsed', true)
    });

    setTimeout( () => {
        dqs('#success-msg').innerHTML =  "JS/CSS added. Refresh to see changes!"
    }, 500)

}

dqs('#save-btn').addEventListener('click', injectNow)


dqsA('.accordion-header').forEach ( h => {
    h.addEventListener('click', (e) => e.target.tagName != 'INPUT' && toggleAccordion(h.parentElement.className))
})

browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
    let tab = tabs[0];
    let url = tab.url.replace('https://', '').replace('http://', '').split('/')[0];
    config.url = url
    dqs("#url-div").innerHTML = url;

    ael('#show-local','click', (e)=>{toggleView('block', 'none')});
    ael('#show-global','click', (e)=>{toggleView('none', 'block')});
    ael('#options-page','click', (e)=> {
        browser.runtime.openOptionsPage();
        window.close();
    });

    const renderScriptsData = (res) => {
        const { js, css, jsEnabled, cssEnabled, globalScripts } = (res[url] || {})
        dqs('textarea#css-box').value = (css) || "";
        dqs('textarea#js-box').value = (js) || "";
        dqs('#enable-css').checked = (cssEnabled != false) || "";
        dqs('#enable-js').checked = (jsEnabled != false) || "";
        getGlobalScripts(globalScripts);
    }



    // function getKeyData (key) {
    //     return browser.storage.local.get(key);
    // }
    // function encodeKey (key) { return 'global_script_' + key.replaceAll(' ', '_-_'); }
    // function decodeKey (key) { return key.replace('global_script_', '').replaceAll('_-_', ' '); }



    let gettingItem = browser.storage.local.get(url);
    gettingItem.then( renderScriptsData, (err) => {
        dqs('#success-msg').value = JSON.stringify(err);
    });


    const getGlobalScripts = (enableList=[]) => {
        getKeyData(LIST_KEY_GLOBAL).then( function(res) {
            let checkboxes = (res[LIST_KEY_GLOBAL] || []).map( (k) => {
                return `
                  <div class="script-item">
                  <input id="${k}" type="checkbox" ${enableList.includes(k) ? 'checked="true"' : ''} id="enable-css">
                    <label for="${k}">${decodeKey(k)}</label>
                  </div>
              `
            })
            if (checkboxes.length == 0) checkboxes.push(`
                <br/>
                <span> &#9432; Currently no global scripts are added. </span>
            `)
            dqs("#global-scripts #items").innerHTML = checkboxes.join('')
        })


    }

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
