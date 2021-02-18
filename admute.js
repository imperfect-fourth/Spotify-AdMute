function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const config = { attributes: true };

let muteState = 1; // 1 = unmuted, 0 = muted
let adMute = 0; // to keep track if the player was muted by the extension or the user
let muteBtn;
let forwardBtn;

function getMuteBtn() {
    return new Promise(async (resolve) => {
        // try catch in case DOM is not loaded
        try {
            muteBtn = document.querySelector('.volume-bar').firstChild;
        } catch {
            muteBtn = undefined;
        }

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
        try {
            forwardBtn = document.querySelector('.player-controls__buttons').children[3];
        } catch {
            forwardBtn = undefined;
        }

        if(forwardBtn) {
            resolve();
        } else {
            await sleep(2000);
            getForwardBtn().then(resolve);
        }
    });
}

getMuteBtn().then(() => {
    muteBtn.addEventListener('click', function() {
        muteState = 1-muteState;
    });
});

getForwardBtn().then(()=>{
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

    observer.observe(forwardBtn, config);
});

