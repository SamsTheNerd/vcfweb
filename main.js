
const iv = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
// const iv = window.crypto.getRandomValues(new Uint8Array(12));

function makeKey(){ // :: Promise<CryptoKey>
    return window.crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256,
    },
    true,
    ["encrypt", "decrypt"],
    );
}

async function keyToString(key){ // :: CryptoKey -> Promise<String>
    const rawExported = await window.crypto.subtle.exportKey("raw", key)
    return window.btoa(String.fromCharCode.apply(null, new Uint8Array(rawExported)));
}

function bytesToString(byteArray){
    let dec = new TextDecoder();
    return dec.decode(byteArray);
}

function encrypt(key, msg){
    let enc = new TextEncoder();
    const encoded = enc.encode(msg);
    // counter will be needed for decryption
    // const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // console.log(iv);
    return window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encoded,
    );
}

function decrypt(key, ciphertext){
    // const iv = new Uint8Array([1]);
    return window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
}


window.addEventListener('load', async (ev) => {
    const key = await makeKey();
    const keyString = await keyToString(key);
    console.log(keyString);
    console.log(encodeURI(keyString))
    const encryptedtest = await encrypt(key, "heyyyy");
    console.log(encryptedtest);
    console.log(bytesToString(encryptedtest))
    const decryptedtext = await decrypt(key, encryptedtest)
    console.log(bytesToString(decryptedtext))
    console.log(decryptedtext)
        // window.crypto.subtle.encrypt()

    downloadContactCard(makeContactCard(""))
})

function makeContactCard(additionalData){ // :: String -> String
    return `BEGIN:VCARD
VERSION:4.0
${additionalData}
END:VCARD`
}

// https://stackoverflow.com/questions/54871408/downloading-vcf-file-on-iphone-browser
function downloadContactCard(contactCard){
    // build data url
    var url = 'data:text/x-vcard;charset=utf-8,' + encodeURIComponent(contactCard);

    // ask the browser to download it
    document.location.href = url;
}