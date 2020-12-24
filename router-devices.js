/* Show online devices on the KeeneticOS v3+ */

const crypto = require("crypto");
const fetch = require("node-fetch");
const Jetty = require("jetty");
const jetty = new Jetty(process.stdout);

// Secrets 
const host = 'https://YOUR.KEENETIC.DOMAIN/';
const login = 'YOUR_WEB_USER';
const password = 'YOUR_WEB_PASSWORD';


!function showDevices() {

  function logIn(callback) {

    fetch(host + 'auth', {}, {timeout: 5000})
    .then(r => r.headers)
    .catch(console.log)
    .then(h => {

      const token = h.get('x-ndm-challenge');
      const realm = h.get('x-ndm-realm');
      const sessionid = h.get('set-cookie').split(';')[0];

      const cookies = `_authorized=${login}; sysmode=router; ${sessionid}`;

      function getHash() {
        const a = `${login}:${realm}:${password}`;
        const b = crypto.createHash('md5').update(a).digest('hex');
        const c = token + b;
        const d = crypto.createHash('sha256').update(c).digest('hex');
        return d;
      }
  
      fetch(host + 'auth', {
        "headers": {
          "content-type": 'application/json;charset=UTF-8',
          "cookie": cookies
        },
        "method": "POST",
        "body": JSON.stringify({login, password: getHash()}, null, 2)
      }, {timeout: 5000}).then(a => a.status).then(status => {
        if (status == 200) {
          callback(cookies)
        } else {
          console.log("Auth failed with HTTP code " + status)
        }
      })
  
    })
    .catch(console.log)
  }

  function parseData(jsonData) {
    const targetLen = 30;

    jetty.clear();
    jetty.moveTo([0,0]).reset();
    jsonData.filter(i => i['link'] === 'up')
      .sort((a, b) => a.rxbytes < b.rxbytes)
      .forEach(data => {
        const prefix = Array(targetLen > data.name.length ? targetLen - data.name.length : 0).join(".");
        jetty.text(
          data.name + prefix +
          " 🠧" + Math.round(data.rxbytes * 1e-6, 2) + ' MB' + 
          "\t🠥" + Math.round(data.txbytes * 1e-6, 2) + " MB\r\n"
        )
      });
  }

  function printOnlineHosts(cookies) {
    fetch(host + 'rci/show/ip/hotspot/host', {
      "headers": {
        "accept": "application/json",
        "content-type": "application/json;charset=UTF-8",
        "cookie": cookies
      },
      "method": "GET"
    })
    .then(a => a.json())
    .catch(e => {
      console.log(e);
      if (interval) {
        clearInterval(interval);
        interval = null;
        setupInterval()
      }
    })
    .then(parseData);
  }

  let interval = null;

  function setupInterval() {
    const timeout = 30 * 1000;// update every 30 sec
    logIn(cookies => {
      printOnlineHosts(cookies);
      interval = setInterval(() => {printOnlineHosts(cookies)}, timeout)
    });
  }

  setupInterval()
}()

