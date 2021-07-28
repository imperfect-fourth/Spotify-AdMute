function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getElement(query) {
    return new Promise(async (resolve) => {
        let element = document.querySelector(query);

        if(element) {
            resolve(element);
        } else {
            await sleep(2000);
            getElement(query).then(resolve);
        }
    });
}

const config = { attributes: true };

let muteState = 1; // 1 = unmuted, 0 = muted
let adMute = 0; // to keep track if the player was muted by the extension or the user
let muteBtn;
let nextBtn;


Promise.all([
    getElement('.player-controls__right'),
    getElement('.volume-bar')
])
.then((elements) => {
    [playerControls, volumeBar] = elements;

    nextBtn = playerControls.children[0];
    muteBtn = volumeBar.children[0];
    muteBtn.addEventListener('click', function() {
        muteState = 1-muteState;
    });

    return getElement('[aria-label*="Now playing"]');
})
.then((trackDiv) => {

    let observer = new MutationObserver(function(mutations) {
        if(nextBtn.hasAttribute('disabled')) {
            if(muteState === 1) {
                muteBtn.click();
                adMute = 1;
            }
        } else if(adMute === 1 && muteState === 0) { // unmute only if muted by extension
            muteBtn.click();
            adMute = 0;
        } else {
        }
    });

    observer.observe(trackDiv, config);
});

