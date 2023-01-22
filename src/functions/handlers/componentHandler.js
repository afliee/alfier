const fs = require('fs');
const path = require('path');

module.exports = async (client) => {
    const componentPath = path.join(__dirname, '..', '..', 'components');
    fs.readdirSync(componentPath).forEach((dir) => {
        const componentFiles = fs
            .readdirSync(`${componentPath}/${dir}`)
            .filter((file) => file.endsWith('.js'));
        const { buttons, modals } = client;
        switch (dir) {
            case 'buttons':
                for (const file of componentFiles) {
                    const button = require(`${componentPath}/${dir}/${file}`);
                    buttons.set(button.data.name, button);
                }
                break;
            case 'selectMenus':
                for (const file of componentFiles) {
                    const selectMenu = require(`${componentPath}/${dir}/${file}`);
                    selectMenus.set(selectMenu.data.name, selectMenu);
                }
                break;
            case 'modals':
                for (const file of componentFiles) {
                    const modal = require(`${componentPath}/${dir}/${file}`);
                    modals.set(modal.data.name, modal);
                }
                break;
        }
    });
};
