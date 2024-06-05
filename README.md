
# Discord-home-bot
A discord bot to automate functionality of my home servers


Installation:
    - Install nodejs
    - Clone the repository at "https://github.com/Scrumbb/Discord-home-bot.git"
    - Create a "config.json" file
    - Add the private key file ('id_rsa') on the project root
    - Run npm install to install the necessary modules

Server side:
    - Create a user named 'bot' add it to docker group and change the sudoers file to allow sudo commands without password:
        - sudo adduser bot
        - sudo usermod -aG sudo bot
        - sudo usermod -aG docker bot
        - newgrp docker
        - sudo visudo:
            - Add on the last line 'bot ALL=(ALL:ALL) NOPASSWD: ALL
    - Upload the public key for the bot:
        - su - bot (to run the commands as bot)
        - mkdir -p ~/.ssh
        - echo public_key_string >> ~/.ssh/authorized_keys (replace 'public_key_string' for the text from the 'id_rsa.pub')
        - chmod -R go= ~/.ssh
    


Development:
    - Every time a nem slash command is created, run "node deploy-commands.js"
    - To delete a slash command, first go to te server and retrieve te command id, then replace the 'commandid' in 'remove-commands.js' and run 'node remove-commands.js'
    - To delete all the slash commands run 'node remove-all-commands.js'


Commands to develop:
    - Docker:
        - ls (pi5, ubuntu) -> Lists the containers on all the serveres or a specified server
        - restart ((name of container)) -> Restart a specified contariner
        - stop ((name of container)) -> Stops a specified container 
        - start ((name of container)) -> Start a specified container 
    - Servers:
        - update
        - upgrade


docker container ls -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}"