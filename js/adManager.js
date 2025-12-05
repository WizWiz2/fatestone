class AdManager {
    constructor() {
        this.ysdk = null;
        this.sdkPromise = null;
        this.ensureSdk();
    }

    ensureSdk() {
        if (this.sdkPromise) return this.sdkPromise;

        // Rely on global init from yandex.js
        if (window.ysdkPromise) {
            this.sdkPromise = window.ysdkPromise.then((ysdk) => {
                this.ysdk = ysdk;
                return ysdk;
            });
        } else if (window.ysdk) {
            this.ysdk = window.ysdk;
            this.sdkPromise = Promise.resolve(window.ysdk);
        } else {
            // Fallback for local testing or failure
            console.log('No Yandex SDK found (local dev?)');
            this.sdkPromise = Promise.resolve(null);
        }

        return this.sdkPromise;
    }

    showRewardedVideo(onReward, onClose) {
        this.ensureSdk().then((ysdk) => {
            if (ysdk && ysdk.adv) {
                ysdk.adv.showRewardedVideo({
                    callbacks: {
                        onOpen: () => {
                            console.log('Video ad open.');
                        },
                        onRewarded: () => {
                            console.log('Rewarded!');
                            onReward();
                        },
                        onClose: () => {
                            console.log('Video ad closed.');
                            if (onClose) onClose();
                        },
                        onError: (e) => {
                            console.log('Error while open video ad:', e);
                            if (onClose) onClose();
                            // Fallback to mock if real ad fails? 
                            // Usually better to just fail gracefully or show mock if strictly local dev.
                        }
                    }
                });
            } else {
                console.log('SDK not ready or local dev, showing Mock Ad');
                this.showMockAd(onReward);
            }
        });
    }

    showFullscreenAd(onClose) {
        this.ensureSdk().then((ysdk) => {
            if (ysdk && ysdk.adv) {
                ysdk.adv.showFullscreenAdv({
                    callbacks: {
                        onClose: function () {
                            if (onClose) onClose();
                        },
                        onError: function (e) {
                            console.log('Error while open fullscreen ad:', e);
                            if (onClose) onClose();
                        }
                    }
                });
            } else {
                console.log('Mock Interstitial Ad (Skipped)');
                if (onClose) onClose();
            }
        });
    }

    showMockAd(onReward) {
        const adModal = document.getElementById('ad-modal');
        const adTimer = document.getElementById('ad-timer');
        const closeAdBtn = document.getElementById('close-ad-btn');

        if (!adModal) {
            console.error('Ad modal not found!');
            if (onReward) onReward();
            return;
        }

        adModal.classList.remove('hidden');
        adModal.classList.add('active');
        if (closeAdBtn) closeAdBtn.classList.add('hidden');

        let timeLeft = 3;
        if (adTimer) adTimer.textContent = timeLeft;

        const interval = setInterval(() => {
            timeLeft--;
            if (adTimer) adTimer.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                if (closeAdBtn) closeAdBtn.classList.remove('hidden');
            }
        }, 1000);

        // Remove old listeners to prevent duplicates
        if (closeAdBtn) {
            const newBtn = closeAdBtn.cloneNode(true);
            closeAdBtn.parentNode.replaceChild(newBtn, closeAdBtn);

            newBtn.onclick = () => {
                adModal.classList.add('hidden');
                adModal.classList.remove('active');
                if (onReward) onReward();
            };
        } else {
            // If no close button, just auto-close after timer (fallback)
            setTimeout(() => {
                adModal.classList.add('hidden');
                adModal.classList.remove('active');
                if (onReward) onReward();
            }, 3500);
        }
    }
}

const adManager = new AdManager();
window.adManager = adManager;
