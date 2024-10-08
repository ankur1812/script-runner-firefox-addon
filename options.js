const LIST_KEY_GLOBAL = 'global-scripts-names';

function deleteItem (el, name) {
    let key = encodeKey(name);
    browser.storage.local.remove(key).then(() => {
        globalScriptsKeyList.splice(globalScriptsKeyList.indexOf(key), 1);
        browser.storage.local.set({
            [LIST_KEY_GLOBAL]: globalScriptsKeyList
        })
        el?.parentElement?.removeChild(el);
    });
}

function getKeyData (key) {
    return browser.storage.local.get(key);
}

function encodeKey (key) { return 'global_script_' + key.replaceAll(' ', '_-_'); }
function decodeKey (key) { return key.replace('global_script_', '').replaceAll('_-_', ' '); }


let globalScriptsKeyList = [];

function saveScript (name, js, css, isNew) {
    if(isNew) name = document.querySelector('#new-script-name').value;
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
        setTimeout( () => {
            renderScriptsList('#scripts-list', [{ name, js, css}])
        }, 1000)
    }
}


function renderScriptsList(querySelector, scripts) {
    const container = document.querySelector(querySelector);
    const ul = container.querySelector('ul') || document.createElement('ul');

    scripts.forEach((script, index) => {
        const li = document.createElement('li');

        const header = document.createElement('div');
        header.classList.add('accordion-header'); // Apply CSS class
        header.innerHTML = `
        <div class="space-between">
            <div>${script.blankTemplate ? '<input disabled id="new-script-name" placeholder="Name" />' : script.name}</div>
            <div class="actions">
                <span class="edit float-right">${script.blankTemplate ? 'Add New' : 'Edit'}</span>
                ${script.blankTemplate ? '' : '<span class="delete float-right">Delete</span>'}
            </div>
        </div>
        `

        const content = document.createElement('div');
        content.classList.add('accordion-content');

        const jsTitle = document.createElement('label');
        jsTitle.innerText = 'JS Code'

        const jsCodeTextarea = document.createElement('textarea');
        jsCodeTextarea.value = script.js;
        jsCodeTextarea.disabled = true;
        jsCodeTextarea.classList.add('code-textarea');
        jsCodeTextarea.placeholder = 'JavaScript Code';

        const cssTitle = document.createElement('label');
        cssTitle.innerText = 'CSS Code'


        const cssCodeTextarea = document.createElement('textarea');
        cssCodeTextarea.value = script.css;
        cssCodeTextarea.disabled = true;
        cssCodeTextarea.classList.add('code-textarea');
        cssCodeTextarea.placeholder = 'CSS Code';

        const saveBtn = document.createElement('button');
        saveBtn.className = 'save-btn';
        saveBtn.style.display = 'none';
        saveBtn.disabled = true;
        saveBtn.innerText = 'Save';

        saveBtn.addEventListener('click', () => {
            saveScript(script.name, jsCodeTextarea.value, cssCodeTextarea.value, script.blankTemplate);
            jsCodeTextarea.disabled = true;
            cssCodeTextarea.disabled = true;
            saveBtn.style.display = 'none';
            content.style.display = 'none';
            if(script.blankTemplate){
                jsCodeTextarea.value = '';
                cssCodeTextarea.value = '';
                document.querySelector('#new-script-name').disabled = true;
            }
        })


        content.appendChild(jsTitle);
        content.appendChild(jsCodeTextarea);
        content.appendChild(document.createElement('br'));
        content.appendChild(cssTitle);
        content.appendChild(cssCodeTextarea);
        content.appendChild(saveBtn)

        header.addEventListener('click', (e) => {
            let expand = false;
            if (e.target.classList.contains('edit')) {
                if (script.blankTemplate) {
                    let nameInput = document.querySelector('#new-script-name');
                    nameInput.disabled = false;
                    nameInput.focus();
                }
                expand = true;
                jsCodeTextarea.disabled = false;
                !script.blankTemplate && jsCodeTextarea.focus();
                cssCodeTextarea.disabled = false;
                saveBtn.disabled = false;
                saveBtn.style.display = 'block';

            }
            else if (e.target.classList.contains('delete')) {
                deleteItem(li, name)
                return;
            }

            content.style.display = (expand || content.style.display !== 'block') ? 'block' : 'none';
        });

        li.appendChild(header);
        li.appendChild(content);

        ul.appendChild(li);
    });
    if (!container.querySelector('ul'))
        container.appendChild(ul);
}

getKeyData(LIST_KEY_GLOBAL).then( (res) => {
    globalScriptsKeyList = res[LIST_KEY_GLOBAL] || [];
    let scripts = [];
    console.log('globalScriptsKeyList', globalScriptsKeyList)
    let promises = []
    res[LIST_KEY_GLOBAL]?.forEach( key => {
        promises.push(getKeyData(key));
    })
    Promise.allSettled(promises).then( res2 => {
        res2.forEach( resp => {
            let keys = Object.keys(resp.value);
            keys.forEach(key => {
                scripts.push({...resp.value[key], name: decodeKey(key)})

            })
        })
        console.log('Scripts list');
        scripts.unshift({name: '', js: '', css: '', blankTemplate: true})
        renderScriptsList('#scripts-list', scripts)
    })
    if(promises.length == 0){
        renderScriptsList('#scripts-list', [{name: '', js: '', css: '', blankTemplate: true}])

    }

})



// renderScriptsList('#scripts-list', [
//     {name: 'dark theme', js: "//alert();", css: "button {color: darkblue;} }"} ,
//     {name: 'alert function', js: "alert('hello');", css: ""},
//     {name: 'dark theme with alert function', js: "alert('hello');", css: "button {color: darkblue;} }"}
// ])
