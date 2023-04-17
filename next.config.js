/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
};

const withTM = require("next-transpile-modules")([
    "vis-timeline",
    "react-visjs-timeline",
    "react-leaflet-cluster",
]);

module.exports = withTM({
    future: {
        webpack5: true,
    },
    reactStrictMode: true,
});

//module.exports = nextConfig;
