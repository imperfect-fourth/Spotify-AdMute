function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const config = { attributes: true, childList: true, subtree: true };

let muteState = 1; //1 = unmuted, 0 = muted
let muteBtn;

function getMuteBtn() {
    return new Promise(async (resolve) => {
        muteBtn = document.querySelector('.spoticon-volume-16.control-button.volume-bar__icon');
        if(muteBtn) {
            console.log(muteBtn);
            resolve();
        } else {
            await sleep(2000);
            getMuteBtn().then(resolve);
        }
    });
}

let titleDiv;
function getTitleDiv() {
    return new Promise(async(resolve) => {
        titleDiv = document.querySelector('._3773b711ac57b50550c9f80366888eab-scss.ellipsis-one-line');
        if(titleDiv) {
            console.log(titleDiv);
            resolve();
        } else {
            await sleep(2000);
            getTitleDiv().then(resolve);
        }
    });
}

getMuteBtn().then(() => {
    muteBtn.addEventListener('click', function() {
        muteState = 1-muteState;
    });
});

getTitleDiv().then(()=>{
    let observer = new MutationObserver(function(mutations) {
        const title = titleDiv.innerText;
        if(title === "Advertisement" && muteState === 1) {
            muteBtn.click();
        } else if(title !== "Advertisement" && muteState === 0) {
            muteBtn.click();
        } else {
        }
    });

    observer.observe(titleDiv, config);
});

