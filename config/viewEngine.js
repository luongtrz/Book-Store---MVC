const path = require('path');
const { engine } = require('express-handlebars');

const configureViewEngine = (app) => {
    app.engine('hbs', engine({
        extname: 'hbs',
        defaultLayout: 'main',
        layoutsDir: path.join(__dirname, '../views/layouts'),
        partialsDir: path.join(__dirname, '../views/partials'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
    }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));
};

module.exports = configureViewEngine;