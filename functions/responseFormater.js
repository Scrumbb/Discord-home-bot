// responseFormater.js

/**
 * Splits a response from the server in a more elegat way 
 * @param {string} response - The input string to split.
 * @param {boolean} multipleServers - True if multiple servers were used to obtain the response.
 * @returns {Array<string>} - The resulting array of strings.
 */

/* 
---------------------------------------------------------------------------------------------
----- All the responses must be formated in a way that '\v\v\v' separates diferent servers
----- and '\t\t\t' separates diferent partes of the server response.
---------------------------------------------------------------------------------------------
 */

function responseFormater(response, multipleServers) {

    let responseArray = [];

    if (multipleServers) {
        const serversArray = response.split('\v');
        response = '';

        serversArray.forEach((server) => {
            if (server.length < 1900) {
                response += server;
                response += '```';
                responseArray = responseArray.concat(response);
                response = '```';
            } else {
                response += server;
                responseArray = responseArray.concat(splitSingleServer(response));
                response = '```';
            }
        });

    } else {
        if (response.length < 1900) {
            return [response += '```'];
        }

        responseArray = responseArray.concat(splitSingleServer(response));
    }

    return responseArray;
}

function splitSingleServer(response) {

    let splitArray = [];

    const zonesArray = response.split('\t\t\t');
    response = '';

    zonesArray.forEach((zone) => {
        if (zone.length < 1900) {
            if (zone != '') {
                response += zone;
                response += '```';
                splitArray = splitArray.concat(response);
                response = '```';
            }
        } else {
            const linesArray = zone.split('\n');

            linesArray.forEach((line) => {
                if ((response + line).length > 1900) {
                    response += '```';
                    splitArray = splitArray.concat(response);
                    response = '```';
                    response += line;
                    response += '\n';
                } else {
                    response += line;
                    response += '\n';
                }
            });
        }
    });

    return splitArray;
}

module.exports = { responseFormater };