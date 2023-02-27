require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ascii = require('ascii-table');

let table = new ascii('Command Handler');
table.setHeading('Command', 'Loaded');

module.exports = async (client) => {
    const commandPath = path.join(__dirname, '..', '..', 'commands');
    fs.readdirSync(commandPath).forEach((dir) => {
        const commandFiles = fs
            .readdirSync(`${commandPath}/${dir}`)
            .filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const command = require(`../../commands/${dir}/${file}`);
            if ('data' in command && 'execute' in command) {
                table.addRow(command.data.name, '✅');
                client.commands.set(command.data.name, command);
            } else {
                console.log(
                    `[WARNING] The command at ${file} is missing a required "data" or "execute" property.`
                );
                table.addRow(file, '❌');
            }
        }
    });

    console.log(table.toString());
    console.log('Handler command is loaded');
};
