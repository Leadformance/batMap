// Parameters

const mapConfig = {
    /* Gmaps */
    provider: 'gmaps',
    apiKey: 'AIzaSyBgMN26G65UEgkWVDIPKTq-VpvktLmezjQ',

    /* Mappy */
    // provider: 'mappy',
    // apiKey: 'PJ_Bridge',

    locale: 'en',
    locations: locations,
    showCluster: true,
    showLabel: true,
    showPosition: true,
    options: {
        zoom: 12,
        locationZoom: 16,
    },
    markers: {
        default: {
            url: '/oneMapToRuleThemAll/example/assets/images/markers/marker-default.svg',
            width: 38,
            height: 50
        },
        hover: {
            url: '/oneMapToRuleThemAll/example/assets/images/markers/marker-hover.svg',
            width: 38,
            height: 50
        },
        active: {
            url: '/oneMapToRuleThemAll/example/assets/images/markers/marker-active.svg',
            width: 38,
            height: 50
        },
        location: {
            url: '/oneMapToRuleThemAll/example/assets/images/markers/marker-location.svg',
            width: 38,
            height: 50
        },
        user: {
            url: '/oneMapToRuleThemAll/example/assets/images/markers/marker-user.svg',
            width: 38,
            height: 50
        },
        cluster: {
            url: '/oneMapToRuleThemAll/example/assets/images/markers/marker-cluster.svg',
            width: 50,
            height: 50,
            label: {
                origin: [25, 25],
                size: 14
            }
        }
    },
    labels: {
        origin: [19, 19],
        color: 'white',
        font: 'Arial, sans-serif',
        size: '14px',
        weight: 'normal'
    },
    clusters: {}
};
