(function () {
    /**
     * Centralized bootstrap for the Yandex Games SDK.
     * Keeps a single init promise and makes sure LoadingAPI.ready()
     * is called even if init resolves slowly.
     */
    const state = {
        initPromise: null,
        ysdk: null,
        loadingReadyFired: false
    };

    function markReady(source = 'init') {
        if (state.loadingReadyFired) return;
        if (state.ysdk && state.ysdk.features && state.ysdk.features.LoadingAPI) {
            state.loadingReadyFired = true;
            state.ysdk.features.LoadingAPI.ready();
            console.log(`[YandexSDK] LoadingAPI.ready() from ${source}`);
        }
    }

    function initSdk() {
        if (state.initPromise) return state.initPromise;

        if (typeof YaGames === 'undefined') {
            console.warn('[YandexSDK] YaGames is undefined (not running on Yandex?)');
            state.initPromise = Promise.resolve(null);
            return state.initPromise;
        }

        state.initPromise = YaGames.init()
            .then((ysdk) => {
                state.ysdk = ysdk;
                markReady('init');
                return ysdk;
            })
            .catch((err) => {
                console.error('[YandexSDK] YaGames.init() failed:', err);
                return null;
            });

        // Safety net: if init is slow, try to call ready anyway.
        setTimeout(() => {
            if (!state.loadingReadyFired && state.ysdk) {
                markReady('timeout');
            }
        }, 6000);

        return state.initPromise;
    }

    // Kick off init immediately and expose the promise globally.
    window.yandexSDK = { init: initSdk, ready: markReady, state };
    window.ysdkPromise = initSdk();

    // Call ready again on window load in case init resolved earlier.
    window.addEventListener('load', () => markReady('window-load'));
})();
