const express = require('express');
const app = express();
const route = require('./routes/routes.js');
const bodyParser = require('body-parser');
const session = require('express-session');
const PORT = process.env.PORT || 3000;


const hbs = require('express-handlebars');

// CONFIGURAÇÃO HANDLEBARS
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

// CONFIGURAÇÃO SESSION
app.use(session({
    secret: 'CriarUmaChaveQualquer1324!blablaba',
    resave: false,
    saveUninitialized: true
}));

// BODYPARSER
app.use(bodyParser.urlencoded({ extended: false }));

// IMPORTAÇÃO ROTAS
app.get('/', route);
app.get('/users', route);
app.post('/edit', route);
app.post('/cad', route);
app.post('/update', route);
app.post('/del', route);

// IMPORTAR MODELS USUARIOS
const Usuario = require('./models/Usuario.js');

// SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
})
