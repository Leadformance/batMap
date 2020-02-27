// Parameters

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
            url: '/assets/images/markers/marker-default.svg',
            width: 38,
            height: 50
        },
        hover: {
            url: '/assets/images/markers/marker-hover.svg',
            width: 38,
            height: 50
        },
        active: {
            url: '/assets/images/markers/marker-active.svg',
            width: 38,
            height: 50
        },
        location: {
            url: '/assets/images/markers/marker-location.svg',
            width: 38,
            height: 50
        },
        user: {
            url: '/assets/images/markers/marker-user.svg',
            width: 38,
            height: 50
        },
        cluster: {
            url: '/assets/images/markers/marker-cluster.svg',
            width: 50,
            height: 50,
            label: {
                origin: [0, 17],
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
