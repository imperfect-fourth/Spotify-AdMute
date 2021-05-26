function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const config = { attributes: true };

let muteState = 1; // 1 = unmuted, 0 = muted
let adMute = 0; // to keep track if the player was muted by the extension or the user
let muteBtn;
let forwardBtn;
let trackDiv;

function getMuteBtn() {
    return new Promise(async (resolve) => {
        muteBtn = document.querySelector('[aria-label="Mute"]');

        if(muteBtn) {
            resolve();
        } else {
            await sleep(2000);
            getMuteBtn().then(resolve);
        }
    });
}

function getForwardBtn() {
    return new Promise(async(resolve) => {
        forwardBtn = document.querySelector('[aria-label="Next"]');

        if(forwardBtn) {
            resolve();
        } else {
            await sleep(2000);
            getForwardBtn().then(resolve);
        }
    });
}

function getTrackDiv() {
    return new Promise(async(resolve) => {
        trackDiv = document.querySelector('div[aria-label*="Now playing"]')

        if(trackDiv) {
            resolve();
        } else {
            await sleep(2000);
            getTrackDiv().then(resolve);
        }
    });
}

getForwardBtn();

getMuteBtn().then(() => {
    muteBtn.addEventListener('click', function() {
        muteState = 1-muteState;
    });
});

getTrackDiv().then(()=>{
    let observer = new MutationObserver(function(mutations) {
        if(forwardBtn.hasAttribute('disabled')) {
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

