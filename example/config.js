// Parameters

// eslint-disable-next-line no-unused-vars
const mapConfig = {
    /* Gmaps */
    provider: 'gmaps',
    apiKey: 'AIzaSyBgMN26G65UEgkWVDIPKTq-VpvktLmezjQ',
    // apiKey: ['gme-lorealsa', 'Cz_fa_vO6pGrXm7LV9yNKZCJrpA='],

    /* Mappy */
    // provider: 'mappy',
    // apiKey: 'PJ_Bridge',

    /* Leaflet */
    // provider: 'leaflet',
    // apiKey: '',

    locale: 'en',
    locations: locations, // eslint-disable-line no-undef
    showCluster: true,
    showLabel: true,
    showPosition: true,
    options: {
        zoom: 12,
        locationZoom: 16
    },
    markers: {
        default: {
            url: './example/assets/images/markers/marker-default.svg',
            width: 38,
            height: 50
        },
        hover: {
            url: './example/assets/images/markers/marker-hover.svg',
            width: 38,
            height: 50
        },
        active: {
            url: './example/assets/images/markers/marker-active.svg',
            width: 38,
            height: 50
        },
        location: {
            url: './example/assets/images/markers/marker-location.svg',
            width: 38,
            height: 50
        },
        user: {
            url: './example/assets/images/markers/marker-user.svg',
            width: 38,
            height: 50
        },
        cluster: {
            url: './example/assets/images/markers/marker-cluster.svg',
            width: 50,
            height: 50,
            label: {
                origin: [25, 25], //eslint-disable-line no-magic-numbers
                size: 14
            }
        }
    },
    labels: {
        origin: [19, 19], //eslint-disable-line no-magic-numbers
        color: 'white',
        font: 'Arial, sans-serif',
        size: '14px',
        weight: 'normal'
    },
    clusters: {}
};
