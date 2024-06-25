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

            let character = '-';
            let lineText = `Connection ${ip} established!`;
            let lineLenght = lineText.length
            let commandText = command.replace(/\t/g, '\\t');
            //let commandLenght = command.includes('\t') ? command.length + (command.split('\t').length - 1) * 3 : command.length;
            let commandLenght = command.length;
            let biggestLine = lineLenght > commandLenght ? lineLenght : commandLenght;

            biggestLine += 16;

            stdout += `\n`;
            stdout += character.repeat(biggestLine);
            stdout += `\n`;

            let lineToFormat = `Connection ${ip} established!`;
            stdout += formatSingleLine(lineToFormat, biggestLine, character);

            stdout += character.repeat(biggestLine);
            stdout += `\n\n`;

            conn.exec(command, (err, stream) => {

                if (err) {
                    conn.end();
                    return reject(err);
                }
                else {
                    stdout += character.repeat(biggestLine);
                    stdout += `\n`;

                    lineToFormat = `Running:`;
                    stdout += formatSingleLine(lineToFormat, biggestLine, character);
                    lineToFormat = `${commandText}`;
                    stdout += formatSingleLine(lineToFormat, biggestLine, character);

                    stdout += character.repeat(biggestLine);
                    stdout += `\n\t\t\t\n`;
                }
                stream.on('close', (code, signal) => {
                    stdout += `\t\t\t`;
                    stdout += `\n`;
                    stdout += character.repeat(biggestLine);
                    stdout += `\n`;

                    
                    lineToFormat = `Connection ${ip} closed!`;
                    stdout += formatSingleLine(lineToFormat, biggestLine, character);
                    lineToFormat = `Code: ${code}`;
                    stdout += formatSingleLine(lineToFormat, biggestLine, character);

                    stdout += character.repeat(biggestLine);
                    stdout += `\n\n\t\t\t`;

                    conn.end();

                    if (code === 0) {
                        resolve(stdout);
                    } else {
                        reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
                    }

                }).on('data', (data) => {
                    stdout += data;
                }).stderr.on('data', (data) => {
                    stderr += data;
                });
            });
        }).on('error', (err) => {
            return reject(err);
        }).connect({
            host: ip,
            port: port,
            username: username,
            privateKey: privateKey
        });
    });
}

function formatSingleLine(line, size, character){
    let sizeOfCharactersSpace = size - line.length - 2;

    if ((sizeOfCharactersSpace) % 2 != 0){
        const firstPart = Math.ceil((sizeOfCharactersSpace) / 2);
        const secondPart = sizeOfCharactersSpace - firstPart;

        let formatedLine = '';
        
        formatedLine += character.repeat(firstPart);
        formatedLine += ` ${line} `;
        formatedLine += character.repeat(secondPart);
        formatedLine += `\n`;

        return formatedLine;
    }
    else{
        const division = Math.floor((sizeOfCharactersSpace) / 2);

        let formatedLine = '';
        
        formatedLine += character.repeat(division);
        formatedLine += ` ${line} `;
        formatedLine += character.repeat(division);
        formatedLine += `\n`;

        return formatedLine;
    }
}

module.exports = { executeRemoteCommand };
