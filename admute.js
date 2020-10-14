function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const config = { attributes: true, childList: true, subtree: true };

let muteState = 1; // 1 = unmuted, 0 = muted
let adMute = 0; // to keep track if the player was muted by the extension or the user
let muteBtn;

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

let artistDiv;
function getArtistDiv() {
    return new Promise(async(resolve) => {
        artistDiv = document.querySelector('.b6d18e875efadd20e8d037931d535319-scss.ellipsis-one-line');
        if(artistDiv) {
            resolve();
        } else {
            await sleep(2000);
            getArtistDiv().then(resolve);
        }
    });
}

getMuteBtn().then(() => {
    muteBtn.addEventListener('click', function() {
        muteState = 1-muteState;
    });
});

getArtistDiv().then(()=>{
    let observer = new MutationObserver(function(mutations) {
        const artist = artistDiv.innerText;
        if(artist === "Spotify") {
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

    observer.observe(artistDiv, config);
});

