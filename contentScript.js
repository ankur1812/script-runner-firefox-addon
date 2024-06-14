const CSS_KEY = "inject-addon-css";

function addCSS(css) {    
    let cssSheet = document.createElement('style');
    cssSheet.setAttribute('id', CSS_KEY);
    cssSheet.innerText =  css;
    document.body.appendChild(cssSheet);
    console.log('*** INJECT: CSS Added ***')
}
let url = location.href.toString().replace('https://', '').replace('http://', '').split('/')[0];
let gettingItem = browser.storage.local.get(url);
gettingItem.then((data) => {
    console.log("FOUND",  JSON.stringify(data));
    let info = data[url]
    if(info.css) {
        addCSS(info.css.replaceAll("\"", ""));
    }
    if(info.js) {
        try {
            eval(info.js)
        }
        catch (err) {console.log(JSON.stringify(err))}
        
    }
    
}, (err)=> console.log('ERR', JSON.stringify(err)));

