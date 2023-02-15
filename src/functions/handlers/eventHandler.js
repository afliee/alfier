const fs = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Envent Handler');
table.setHeading('Event', 'Loaded');

module.exports = async (client) => {
    const eventPath = './src/events';
    fs.readdirSync(eventPath).forEach((dir) => {
        const eventFiles = fs
            .readdirSync(`${eventPath}/${dir}`)
            .filter((file) => file.endsWith('.js'));
        switch (dir) {
            case 'client':
                for (const file of eventFiles) {
                    const event = require(`../../events/${dir}/${file}`);
                    if (event.once) {
                        table.addRow(event.name, '✅');
                        client.once(event.name, (...args) =>
                            event.execute(...args)
                        );
                    } else {
                        table.addRow(event.name, '✅');
                        client.on(event.name, (...args) =>
                            event.execute(...args)
                        );
                    }
                }
                break;
            case 'distube':
                for (const file of eventFiles) {
                    const event = require(`../../events/${dir}/${file}`);
                    try {
                        event.execute(client);
                    } catch (err) {
                        console.log(err);
                    }
                }
                break;
        }
    });
    console.log(table.toString());
};
