function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

function getDefaultProxyUrl() {
    var appName = 'isfront-bid';
    process.argv.forEach((arg) => {
        if (arg.indexOf(':') > 0) {
            appName = arg.replace(/[:].*/, '')
        }
    });

    var bankName = appName.replace(/[^-]*[-]/, '');
    return `http://ostk-${bankName}-front.infosysco.ru`
}

var defaultProxyUrl = 'http://localhost:8081';//getDefaultProxyUrl()
console.log(`Default proxy url ${defaultProxyUrl}. You can make overide url using cookie apiBaseUrl`)

function resolveAddress(req) {

    var devName = defaultProxyUrl;
    var rc = req.headers.cookie;
    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        // if (parts.shift().trim() === 'apiBaseUrl') {
        //     devName = decodeURI(parts.join('='));
        // }
    });

    return devName;
}

const PROXY_CONFIG = [
    {
        context: [
            "/ibank-core-demo",
            "/imgcache",
            "/json",
            "/api_xml",
            "/resources",
            "/export",
            "/upload",
            "/download",
            "/state_services"
        ],
        target: true,
        router: function (req) {
            const adress = resolveAddress(req);
            req.headers['host'] = adress.replace('http://', '').replace('https://', '');
            return adress;
        },
        timeout: 360000,
        onProxyRes: function (proxyRes, req, res) {

            if (proxyRes.headers['set-cookie']) {
                let setCookies = proxyRes.headers['set-cookie']
                let newSetCookie = [];
                setCookies.forEach((cookie) => {
                    newSetCookie.push(cookie.replace('Secure;', '').replace('SameSite=None;', ''));
                })
                proxyRes.headers['set-cookie'] = newSetCookie
            }

        },
        changeOrigin: true,
        secure: false,
        xfwd: true,
    },
    {
        context: [
            "/chat-stomp-endpoint"
        ],
        target: true,
        router: function (req) {

            var requestUrl = req.url;
            const adress = resolveAddress(req);
            if (adress.indexOf('172') < 0) {
                req.headers['host'] = adress.replace('http://', '').replace('https://', '');
            }
            var newAdress = adress;
            if (requestUrl.indexOf('/stomp/info') < 0) {
                newAdress = adress.replace('http://', 'ws://')
                    .replace('https://', 'wss://');
            }

            return newAdress;
        },
        onProxyReqWs: function (proxyReq, req, socket, options, head) {
            proxyReq.removeHeader('origin');
            proxyReq.removeHeader('Origin');
        },
        changeOrigin: true,
        secure: false,
        ws: true,
        wss: true,
        xfwd: true
    }
];

module.exports = PROXY_CONFIG;

