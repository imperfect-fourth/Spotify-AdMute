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
        muteBtn = document.querySelector('.spoticon-volume-16.control-button.volume-bar__icon');
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
        forwardBtn = document.querySelector('.control-button.spoticon-skip-forward-16');
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

