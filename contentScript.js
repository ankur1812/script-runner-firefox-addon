const CSS_KEY = "inject-addon-css";

function addCSS(css) {    
    let cssSheet = document.createElement('style');
    cssSheet.setAttribute('id', CSS_KEY);
    cssSheet.innerText =  css;
    document.body.appendChild(cssSheet);
    // console.log('*** INJECT: CSS Added ***')
}
let url = location.href.toString().replace('https://', '').replace('http://', '').split('/')[0];
let gettingItem = browser.storage.local.get(url);
gettingItem.then((data) => {
    // console.log("FOUND local",  JSON.stringify(data));
    let info = data[url]
    debugger;
    if(info.cssEnabled && info.css) {
        addCSS(info.css.replaceAll("\"", ""));
    }
    if(info.jsEnabled && info.js) {
        try { eval(info.js)}
        catch (err) {console.log(JSON.stringify(err))}        
    }
    if(info.globalScripts?.length > 0) 
        info.globalScripts.forEach( k => {
            
            browser.storage.local.get(k).then( res => {
                debugger;
                let globalScriptItem = res[k];
                addCSS(globalScriptItem.css.replaceAll("\"", ""));
                if (globalScriptItem.js){
                    try { eval(globalScriptItem.js)}
                    catch (err) {console.log(JSON.stringify(err))}        
                }
            })

        })
    
}, (err)=> console.log('ERR', JSON.stringify(err)));
