const express = require('express');
const Usuario = require('../models/Usuario');
const { where } = require('sequelize');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.session.errors !== "") {
        var arrayError = req.session.errors;
        var nome = req.session.nome;
        var email = req.session.email;
        req.session.nome = "";
        req.session.email = "";
        req.session.errors = '';
        return res.render('index', { NavActiveCad: true, errorMessage: arrayError, nome, email });
    }
    if (req.session.success) {
        req.session.success = false;
        return res.render('index', { NavActiveCad: true, success: true });
    }
    res.render('index', { NavActiveCad: true });
});

router.get('/users', (req, res) => {
    Usuario.findAll().then((values) => {
        if (values.length > 0) {
            res.render('users', { NavActiveUsers: true, table: true, valores: values.map(values => values.toJSON()) });
        } else {
            res.render('users', { NavActiveUsers: true, table: false });
        }
    }).catch((err) => {
        ("Houve um erro! " + err);
    })

});

router.post('/edit', (req, res) => {
    var id = req.body.id;
    Usuario.findByPk(id).then((dados) => {
        return res.render('edit', { erro: false, id: dados.id, nome: dados.nome, email: dados.email });
    }).catch((err) => {
        res.render('edit', { erro: true, problema: "Não é possível editar esse usuário!" });
    })

});

router.post('/cad', (req, res) => {

    var nome = req.body.nome;
    var email = req.body.email;
    const erro = [];

    nome = nome.trim();
    email = email.trim();

    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '');
    nome = nome.trim();

    if (nome == '' || nome == undefined || nome == null) {
        erro.push({ mensagem: "O campo nome é obrigatório!" });
    }

    if (email == '' || email == undefined || email == null) {
        erro.push({ mensagem: "O campo email é obrigatório!" });
    }

    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)) {
        erro.push({ mensagem: "Nome inválido!" });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erro.push({ mensagem: "Campo email inválido!" });
    }

    if (erro.length > 0) {
        req.session.errors = erro;
        req.session.success = false;
        var tempNome = req.body.nome;
        var tempEmail = req.body.email;
        req.session.nome = tempNome;
        req.session.email = tempEmail;
        return res.redirect('/');
    }

    Usuario.create({
        nome: nome,
        email: email.toLowerCase()
    }).then(function () {
        req.session.success = true;
        return res.redirect('/');
    }).catch(function (err) {
        console.log('Ops, ocorreu um erro. ' + err);
    });

});

router.post('/update', (req, res) => {

    var nome = req.body.nome;
    var email = req.body.email;
    const erro = [];

    nome = nome.trim();
    email = email.trim();

    nome = nome.replace(/[^A-zÀ-ú\s]/gi, '');
    nome = nome.trim();

    if (nome == '' || nome == undefined || nome == null) {
        erro.push({ mensagem: "O campo nome é obrigatório!" });
    }

    if (email == '' || email == undefined || email == null) {
        erro.push({ mensagem: "O campo email é obrigatório!" });
    }

    if (!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(nome)) {
        erro.push({ mensagem: "Nome inválido!" });
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        erro.push({ mensagem: "Campo email inválido!" });
    }

    if (erro.length > 0) {
        console.log(erro);
        return res.status(400).send({ status: 400, erro: erro });
    }

    Usuario.update(
        {
            nome: nome,
            email: email.toLowerCase()
        }, {
        where: {
            id: req.body.id
        }
    }
    ).then(() => {
        return res.redirect('users');
    }).catch((err) => {
        console.log(err);
    })
});

router.post('/del', (req, res) => {
    Usuario.destroy({
        where: {
            id: req.body.id
        }
    }).then((value) => {
        res.redirect('users');
    }).catch((err) => {
        console.log(err);
    })
});

module.exports = router;