
Show online devices on the KeeneticOS. It's a CLI nodejs app. 

![screen](https://raw.githubusercontent.com/coffebar/router-mon/master/screen.png)

Updates every 30 sec. Additionally shows the amount of transferred data.

# Setup
1. Create a new user on your KeeneticOS device. Set permissions only for readonly web access.
![screen](https://raw.githubusercontent.com/Hukuta/router-mon/master/permissions.png)
2. Clone this repo: ```git clone https://github.com/coffebar/router-mon.git```
3. Install required modules: ```cd router-mon && npm install```
4. Update secrets in router-devices.js file.
```
// Secrets 
const host = 'https://YOUR.KEENETIC.DOMAIN/';
const login = 'YOUR_WEB_USER';
const password = 'YOUR_WEB_PASSWORD';
```
5. Run script: ```node router-devices.js```

Done.
