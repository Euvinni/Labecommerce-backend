"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dataBase_1 = require("./dataBase");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});
app.get("/ping", (req, res) => {
    res.send("Pong!");
});
//Busca por usuário
app.get("/users", (req, res) => {
    try {
        const getAllUsers = dataBase_1.users;
        if (getAllUsers.length === 0) {
            throw new Error("Nenhum usuário foi encontrado");
        }
        res.status(200).send(getAllUsers);
    }
    catch (error) {
        console.log(error);
        if (res.statusCode === 200) {
            res.status(500);
        }
        res.send(error.message);
    }
});
// Busca por produtos 
app.get("/products", (req, res) => {
    try {
        const result = dataBase_1.products;
        res.status(200).send(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro no produtos");
        }
    }
});
// Procurando produto por query 
app.get("/products/search", (req, res) => {
    try {
        const query = req.query.q;
        if (query.length === 0) {
            res.statusCode = 404;
            throw new Error("Query deve possuir pelo menos um caractere");
        }
        const productsByName = dataBase_1.products.filter((product) => product.name.toLowerCase().startsWith(query.toLowerCase()));
        if (productsByName.length === 0) {
            res.statusCode = 404;
            throw new Error(`Nenhum produto encontrado para a query "${query}"`);
        }
        res.status(200).send(productsByName);
    }
    catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
        else {
            res.send("Erro: a query deve possuir pelo menos um caractere");
        }
    }
});
// Criando um novo usuário e checando se já existe
app.post("/users", (req, res) => {
    try {
        const { id, name, email, password, createdAt } = req.body;
        const checkIdUser = dataBase_1.users.find((user) => user.id === id);
        if (checkIdUser) {
            res.statusCode = 400;
            throw new Error("Esse 'id' já existe em nosso banco de dados");
        }
        const checkEmail = dataBase_1.users.find((user) => user.email === email);
        if (checkEmail) {
            res.statusCode = 400;
            throw new Error("Esse 'email' já existe em nosso banco de dados");
        }
        const newUser = {
            id,
            name,
            email,
            password,
            createdAt
        };
        dataBase_1.users.push(newUser);
        res.status(200).send("Cadastro realizado com sucesso!");
    }
    catch (error) {
        console.log(error);
        res.send(error.message);
    }
});
// Criando um novo produto 
app.post("/products", (req, res) => {
    try {
        const { id, name, price, description, imageUrl } = req.body;
        const CheckIdProduct = dataBase_1.products.find((product) => product.id === id);
        if (CheckIdProduct) {
            throw new Error("Este 'id' deste produto já existe em nosso banco de dados");
        }
        const newProduct = {
            id,
            name,
            price,
            description,
            imageUrl,
        };
        dataBase_1.products.push(newProduct);
        res.status(201).send("Produto cadastrado com sucesso!");
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
});
// Deletando usuários 
app.delete("/users/:id", (req, res) => {
    try {
        const id = req.params.id;
        const indexDelete = dataBase_1.users.findIndex((user) => user.id === id);
        if (indexDelete === -1) {
            res.statusCode = 400;
            throw new Error("Usuário não encontrado!");
        }
        if (indexDelete >= 0) {
            dataBase_1.users.splice(indexDelete, 1);
            res.status(200).send("O usuário foi deletado com sucesso!");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
});
// Deletando produtos 
app.delete("/products/:id", (req, res) => {
    try {
        const id = req.params.id;
        const indexDelet = dataBase_1.products.findIndex((product) => product.id === id);
        if (indexDelet === -1) {
            res.statusCode = 400;
            throw new Error("Produto não encontrado!");
        }
        if (indexDelet >= 0) {
            dataBase_1.products.splice(indexDelet, 1);
            res.status(200).send("Produto foi deletado com sucesso!");
        }
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
// Editando produtos 
app.put("/products/:id", (req, res) => {
    try {
        const id = req.params.id;
        const product = dataBase_1.products.find((product) => product.id === id);
        if (!product) {
            res.statusCode = 400;
            throw new Error("Produto não encontrado!");
        }
        const { name, price, description, imageUrl } = req.body;
        if (typeof name !== "string") {
            res.statusCode = 400;
            throw new Error("O nome do produto deve ser um texto");
        }
        if (typeof price !== "number") {
            res.statusCode = 400;
            throw new Error("O preço do produto deve ser um número");
        }
        if (typeof description !== "string") {
            res.statusCode = 400;
            throw new Error("A descrição do produto deve ser um texto");
        }
        if (typeof imageUrl !== "string") {
            res.statusCode = 400;
            throw new Error("A url do produto deve ser um texto");
        }
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.imageUrl = imageUrl || product.imageUrl;
        res.status(200).send({ message: "Produto atualizado com sucesso!" });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
});
////////////
//
