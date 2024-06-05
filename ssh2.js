const fs = require('fs');
const path = require('node:path');
const { Client } = require('ssh2');

// Path to your private key file
const privateKeyPath = path.join(__dirname, 'privatekey', 'id_rsa');
const privateKey = fs.readFileSync(privateKeyPath);

// SSH connection configuration
const config = {
    host: '10.0.0.150',
    port: 22,
    username: 'bot',
    privateKey: privateKey
};

const conn = new Client();

let output = '';

conn.on('ready', () => {
    //console.log('Client :: ready');
    output += `Connection established!\n`;

    // Path to the bash script on the remote server
    const remoteScriptPath = '/home/bot/update_script.sh';

    

    //conn.exec(`bash ${remoteScriptPath}`, (err, stream) => {
    conn.exec(`docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"`, (err, stream) => {
        if (err) throw err;
        stream.on('close', (code, signal) => {
            console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);
            //output += `Connection closed!`;
            conn.end();
            //console.log(output);
        }).on('data', (data) => {
            console.log('' + data);
            //output += data;
        }).stderr.on('data', (data) => {
            console.error('STDERR: ' + data);
        });
    });
}).connect(config);
