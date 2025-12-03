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
                resolve(window.YaGames);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://yandex.ru/games/sdk/v2';
            script.async = true;
            script.onload = () => resolve(window.YaGames);
            script.onerror = () => reject(new Error('YaGames SDK failed to load'));
            document.head.appendChild(script);
        })
            .then((YaGames) => {
                if (!YaGames) return null;
                return YaGames.init();
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
                            this.showMockAd(onReward);
                        }
                    }
                });
            } else {
                console.log('Showing Mock Ad');
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
                        onError: function () {
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

        adModal.classList.remove('hidden');
        adModal.classList.add('active');
        closeAdBtn.classList.add('hidden');

        let timeLeft = 3;
        adTimer.textContent = timeLeft;

        const interval = setInterval(() => {
            timeLeft--;
            adTimer.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(interval);
                closeAdBtn.classList.remove('hidden');
            }
        }, 1000);

        // Remove old listeners to prevent duplicates
        const newBtn = closeAdBtn.cloneNode(true);
        closeAdBtn.parentNode.replaceChild(newBtn, closeAdBtn);

        newBtn.onclick = () => {
            adModal.classList.add('hidden');
            adModal.classList.remove('active');
            onReward();
        };
    }
}

const adManager = new AdManager();
window.adManager = adManager;
