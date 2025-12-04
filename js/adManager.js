class AdManager {
    constructor() {
        this.ysdk = null;
        this.sdkPromise = null;
        this.ensureSdk();
    }

    ensureSdk() {
        if (this.sdkPromise) return this.sdkPromise;

        this.sdkPromise = new Promise((resolve, reject) => {
            if (window.YaGames) {
                resolve(window.YaGames.init());
                return;
            }
            // Wait for script to load if it hasn't already (though it's in head now)
            window.onload = () => {
                if (window.YaGames) {
                    resolve(window.YaGames.init());
                } else {
                    reject(new Error('YaGames SDK not found'));
                }
            };
            // Fallback if window.onload already fired or script is async
            if (document.readyState === 'complete' && window.YaGames) {
                resolve(window.YaGames.init());
            }
        })
            .then((ysdk) => {
                if (ysdk) {
                    console.log('Yandex SDK initialized');
                    this.ysdk = ysdk;
                }
                return ysdk;
            })
            .catch((err) => {
                console.error('Yandex SDK init error:', err);
                return null;
            });

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
