export class AdManager {
    constructor() {
        this.ysdk = null;
        this.initYandex();
    }

    initYandex() {
        if (window.YaGames) {
            window.YaGames.init()
                .then(ysdk => {
                    console.log('Yandex SDK initialized');
                    this.ysdk = ysdk;
                })
                .catch(err => {
                    console.error('Yandex SDK init error:', err);
                });
        } else {
            console.log('Yandex SDK not found (running locally?)');
        }
    }

    showRewardedVideo(onReward, onClose) {
        if (this.ysdk) {
            this.ysdk.adv.showRewardedVideo({
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
                        // Fallback to mock if error (optional)
                        if (onClose) onClose();
                    }
                }
            });
        } else {
            // Mock Ad for testing
            console.log("Showing Mock Ad");
            this.showMockAd(onReward);
        }
    }

    showFullscreenAd(onClose) {
        if (this.ysdk) {
            this.ysdk.adv.showFullscreenAdv({
                callbacks: {
                    onClose: function (wasShown) {
                        if (onClose) onClose();
                    },
                    onError: function (error) {
                        if (onClose) onClose();
                    }
                }
            });
        } else {
            console.log("Mock Interstitial Ad (Skipped)");
            if (onClose) onClose();
        }
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

export const adManager = new AdManager();
