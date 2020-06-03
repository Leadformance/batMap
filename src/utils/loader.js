"use strict";

const defaultLoaderClass = "batmap__spinner";

module.exports = {
    addLoader: function (domElement, callback, customClass = null) {
        let loader = document.createElement("div");

        if (typeof customClass === "string") {
            loader.className = customClass;
        } else {
            loader.className = defaultLoaderClass;
        }

        domElement.appendChild(loader);

        return function () {
            domElement.removeChild(loader);
            callback();
        };
    },
};
