const LIST_KEY_GLOBAL = 'global-scripts-names';
let globalScriptsKeyList = [];

const dqs = (s) => document.querySelector(s);
const dqsA = (s) => Array.from(document.querySelectorAll(s));
const ael = (s, e, fn, z=false) => dqs(s).addEventListener(e, fn, z)

const getKeyData = (key) => {
    return browser.storage.local.get(key);
}
const encodeKey = (key) => { return 'global_script_' + key.replaceAll(' ','_-_'); }
const decodeKey = (key) => { return key.replaceAll('global_script_', '').replaceAll('_-_', ' '); }

function saveScript (name, js, css, isNew, override = false) {
    if(isNew && !override) name = document.querySelector('#new-script-name').value;
    if(!name) return;
    let scriptName = encodeKey(name);

    browser.storage.local.set({
        [scriptName]: {
            css,
            js
        }
    });
    if (isNew) {
        globalScriptsKeyList.push(scriptName);
        browser.storage.local.set({
            [LIST_KEY_GLOBAL]: globalScriptsKeyList
        })
        dqs('#scripts-list') && setTimeout( () => {
            renderScriptsList('#scripts-list', [{ name, js, css}])
        }, 500)
    }
}

const initializeDefaultScripts = () => {
    let defaultScripts = [
        {
            name: encodeKey('Dark Theme 1 (Standard)'),
            js: '',
            css: `
                html, body, header, .header, footer, aside, nav { background: #1f1f1 !important; color: #e0e0e0 !important;}
                *:not(html):not(body):not(header):not(.header):not(footer):not(aside):not(nav):not(input):not(textarea):not(select):not(button) {
                    background: inherit !important; color: inherit !important;
                }
                button, input, textarea, select {
                    background: #121212 !important; color: white !important; border: 1px solid #424242 !important;
                }
            `
        },
        {
            name: encodeKey('Dark Theme 2 (Alternate)'),
            js: '',
            css: `
                html, body, header, footer, aside, nav { background: #1f1f1f !important; color: #e0e0e0 !important;}
                *:not(html):not(body):not(header):not(.header):not(footer):not(aside):not(nav):not(input):not(textarea):not(select):not(button) {
                    background: transparent !important; color: inherit !important;
                }
                button, input, textarea, select {
                    background: #121212 !important; color: white !important; border: 1px solid #424242 !important;
                }

            `
        }
    ];
    defaultScripts.forEach( s => {
        saveScript(s.name, s.js, s.css, true, true)
    })

    browser.storage.local.set({
      isInitialized: true
    })
}


getKeyData('isInitialized').then( res => {
    if (!res.isInitialized) {
        initializeDefaultScripts();
        setTimeout(() => window.location.reload(), 100);
    }
})
