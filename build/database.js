"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProductsByName = exports.getAllProduct = exports.createProduct = exports.products = exports.getAllUsers = exports.createUser = exports.users = void 0;
exports.users = [
    {
        id: 'u001',
        name: 'Fulano',
        email: 'fulano@email.com',
        password: 'fulano123',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u002',
        name: 'Beltrana',
        email: 'beltrana@email.com',
        password: 'beltrana00',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u003',
        name: 'Ciclano',
        email: 'Ciclano@email.com',
        password: 'Ciclano456',
        createdAt: new Date().toISOString()
    },
];
const createUser = (id, name, email, password) => {
    const createdAt = new Date().toISOString();
    const newUser = {
        id: id,
        name: name,
        email: email,
        password: password,
        createdAt: createdAt
    };
    exports.users.push(newUser);
    return "Cadastro realizado com sucesso";
};
exports.createUser = createUser;
const getAllUsers = () => {
    return exports.users;
};
exports.getAllUsers = getAllUsers;
exports.products = [
    {
        id: 'prod001',
        name: 'Mouse gamer',
        price: 250,
        description: 'Melhor mouse do mercado',
        image_Url: 'https://picsum.photos/seed/Mouse%20gamer/400',
    },
    {
        id: 'prod002',
        name: 'Monitor',
        price: 900,
        description: 'Monitor LED Full HD 24 polegadas',
        image_Url: 'https://picsum.photos/seed/Monitor/400',
    },
];
const createProduct = (id, name, price, description, imageUrl) => {
    const newProduct = {
        id: id,
        name: name,
        price: price,
        description: description,
        image_Url: 'https://picsum.photos/seed/Monitor/400',
    };
    exports.products.push(newProduct);
    return "Produto criado com sucesso";
};
exports.createProduct = createProduct;
const getAllProduct = () => {
    return exports.products;
};
exports.getAllProduct = getAllProduct;
const searchProductsByName = (name) => {
    const filterProducts = exports.products.filter((product) => {
        return product.name.toLowerCase().includes(name.toLowerCase());
    });
    return filterProducts;
};
exports.searchProductsByName = searchProductsByName;
