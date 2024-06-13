const { Client } = require('ssh2');
const fs = require('fs');

/**
 * Executes a given command on a remote server using SSH.
 * @param {string} ip - The IP address of the server.
 * @param {string} port - The PORT of the server.
 * @param {string} username - The username for SSH authentication.
 * @param {string} privateKeyPath - The path to the private key for SSH authentication.
 * @param {string} command - The command to execute.
 * @returns {Promise<string>} - A promise that resolves with the command output.
 */
function executeRemoteCommand(ip, port, username, privateKeyPath, command) {
    return new Promise((resolve, reject) => {
        const conn = new Client();
        const privateKey = fs.readFileSync(privateKeyPath);

        let stdout = '';
        let stderr = '';

        conn.on('ready', () => {
            //console.log('Client :: ready');

            stdout += `-------------------------------------------------------------------\n`;
            stdout += `----- Connection ${ip} established! -----\n`;
            stdout += `------------------------------------------------------------\n\n`;

            conn.exec(command, (err, stream) => {

                if (err) {
                    conn.end();
                    return reject(err);
                }
                else {
                    
                    stdout += `---------------------------------------------------------------\n`;
                    stdout += `----------- Running: --------------\n`;
                    stdout += `----------- ${command} --------------\n`;
                    stdout += `---------------------------------------------------------------\n\n\t\t\t`;
                }

                stream.on('close', (code, signal) => {

                    stdout += `\t\t\t`;
                    stdout += `\n-----------------------------------------------------------\n`;
                    stdout += `-------- Connection ${ip} closed! -------\n`;
                    stdout += `---------------------- Code: ${code} ----------------------\n`;
                    stdout += `-------------------------------------------------------------\n\n\t\t\t`;

                    conn.end();

                    if (code === 0) {
                        resolve(stdout);
                    } else {
                        reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
                    }

                    //console.log(`Stream :: close :: code: ${code}, signal: ${signal}`);


                }).on('data', (data) => {
                    //console.log('' + data);
                    stdout += data;
                }).stderr.on('data', (data) => {
                    //console.error('STDERR: ' + data);
                    stderr += data;
                });
            });
        }).connect({
            host: ip,
            port: port,
            username: username,
            privateKey: privateKey
        });
    });
}


module.exports = { executeRemoteCommand };
