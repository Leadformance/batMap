# Set options

[&#8672; Go Back](../)

Set map options in `theme.yml`

```yml
# src/Bridge/FrontBundle/Resources/config/theme.yml

theme:
    all:
        javascript:
            components:
                map:
                    provider: "%bridge_front_components.map.provider%"
                    apiKey: "%bridge_front_components.map.api_key%"
                    showCluster: true     # true|false : enable/disable marker clustering
                    showLabel: true       # true|false : enable/disable label on markers
                    showPosition: true    # true|false : enable/disable user geolocation on the map

                    # MAP OPTIONS
                    # It is possible to add native provider options here or directly in the component.
                    options:
                        zoom: 12          # default zoom on results page
                        locationZoom: 16  # default zoom on focus on marker and on location page

                    # MARKERS CONFIGURATION
                    # Each marker type have to had at least an image path (url) and a size (width, height) defined.
                    # Overload default label options for each marker by adding a label property.
                    # Don't set markers for using default provider markers.
                    markers:
                        default:
                            url: "/build/assets/images/markers/marker-default.svg"
                            width: 38
                            height: 50
                        hover:
                            url: "/build/assets/images/markers/marker-hover.svg"
                            width: 38
                            height: 50
                        active:
                            url: "/build/assets/images/markers/marker-active.svg"
                            width: 38
                            height: 50
                        location:
                            url: "/build/assets/images/markers/marker-location.svg"
                            width: 38
                            height: 50
                        user:
                            url: "/build/assets/images/markers/marker-user.svg"
                            width: 38
                            height: 50
                        cluster:
                            url: "/build/assets/images/markers/marker-cluster.svg"
                            width: 50
                            height: 50
                            label:
                                origin: [25, 25]
                                size: 14

                    # LABELS CONFIGURATION
                    # It is possible to overload these default options for each marker by adding a label property.
                    # Don't set labels for using default provider labels.
                    labels:
                        origin: [19, 19]
                        color: "white"
                        font: "'Montserrat', Arial, sans-serif"
                        size: "14px"
                        weight: "normal"

                    # CLUSTER CONFIGURATION
                    # It is possible here to add native provider cluster options
                    clusters:
                        # ...

    actions:
        - action: Bridge\FrontBundle\Controller\FrontController::locationAction
          javascript:
              components:
                    # Overload options (map, markers, labels, clusters) for each pages
                    map:
                        showCluster: false
                        showLabel: false
                        showPosition: false
```
