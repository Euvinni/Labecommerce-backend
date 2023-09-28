-- Active: 1695774689715@@127.0.0.1@3306

-- Criação da tabela users

PRAGMA foreign_keys = ON;

PRAGMA date_class = 'datetime';

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

-- Selecionar tabela users

SELECT * FROM users;

-- Deleta a tabela users

DROP TABLE "users";

-- Criação da tabela products

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_Url TEXT NOT NULL
    );

-- Mostrar apenas a tabela products

SELECT * FROM products;

-- Deleta a tabela products

DROP TABLE "products";

PRAGMA table_info(users);

PRAGMA table_info(products);

-- Criando 3 usuários novos

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u001',
        'SpaceToday',
        'space_today@email',
        'idkfa',
        'O usuário foi criado às ' || strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u002',
        'franklin',
        'franklin@email',
        '123qwe',
        'O usuário foi criado às ' || strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u003',
        'ciriguelo',
        'ciriguelo@email',
        'qwe123',
        'O usuário foi criado às ' || strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    );

-- Deletando um usuário específico

DELETE FROM users WHERE id = 'u002';

-- Criando 5 produtos novos

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_Url
    )
VALUES (
        'prod001',
        'Placa de vídeo RTX 4090Ti',
        18.999,
        'Roda tudo',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod002',
        'Echo Dot 5ª geração Amazon',
        359.99,
        'Escuta tudo',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod003',
        'Teclado Mecânico Gamer HyperX',
        429.99,
        'Nem o Frank Aguiar tem um assim',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod004',
        'Apple Watch S8',
        5849.10,
        'Prefiro gastar na RTX 4090Ti, pelo menos roda tudo',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'prod005',
        'SSD 1TB Kingston KC3000',
        549.99,
        'Prova de que o dinheiro compra tempo',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'prod006',
        'Pasta térmica',
        89.99,
        'Cuidados com o superaquecimento',
        'https://picsum.photos/seed/Monitor/400'
    );

-- Filtando produto por name

SELECT * FROM products WHERE name = 'Placa de vídeo RTX 4090Ti';

-- Editando o produto pelo preço

UPDATE products SET price = 100.99 WHERE id = 'prod006' 

-- Editando todas as propriedades de um produto

UPDATE products
SET
    name = 'Mouse pad',
    price = 100.00,
    description = 'Confortável',
    image_url = 'https://picsum.photos/seed/Monitor/400'
WHERE id = 'prod006';

----