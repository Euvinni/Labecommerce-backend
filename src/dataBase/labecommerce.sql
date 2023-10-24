-- Active: 1698107848814@@127.0.0.1@3306

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
        'space234',
        'O usuário foi criado às ' || strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u002',
        'franklin',
        'franklin@email',
        'fk2789',
        'O usuário foi criado às ' || strftime(
            '%Y-%m-%d %H:%M:%S',
            'now',
            'localtime'
        )
    ), (
        'u003',
        'ciriguelo',
        'ciriguelo@email',
        'ciri2859',
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
        'p01',
        'Produto 1',
        18.999,
        'Descrição 1',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'p02',
        'Produto 2',
        359.99,
        'Descrição 2',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'p03',
        'Produto 3',
        429.99,
        'Descrição 3',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'p04',
        'Produto 4',
        5849.10,
        'Descrição 4',
        'https://picsum.photos/seed/Mouse%20gamer/400'
    ), (
        'p05',
        'Produto 5',
        549.99,
        'Descrição 5',
        'https://picsum.photos/seed/Monitor/400'
    ), (
        'p06',
        'Produto 6',
        89.99,
        'Descrição 6',
        'https://picsum.photos/seed/Monitor/400'
    );

-- Filtando produto por name

SELECT * FROM products WHERE name = 'Placa de vídeo RTX 4090Ti';

-- Editando o produto pelo preço

UPDATE products SET price = 100.99 WHERE id = 'p06' 

-- Editando todas as propriedades de um produto

UPDATE products
SET
    id = 'p07',
    name = 'Produto 7',
    price = 100.00,
    description = 'Descrição 7',
    image_url = 'https://picsum.photos/seed/Monitor/400'
WHERE id = 'p02';

-- Criando tabela de compradores

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer_id TEXT NOT NULL,
        total_price REAL NOT NULL,
        product_id TEXT,
        product_description TEXT,
        created_at DATETIME DEFAULT (
            strftime(
                '%Y-%m-%d %H:%M:%S',
                'now',
                'localtime'
            )
        ),
        FOREIGN KEY (buyer_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

DROP TABLE purchases;

-- Inserindo na tabela de compradores

INSERT INTO
    purchases (id, buyer_id, total_price)
VALUES ('pur01', 'u001', 250.00), ('pur02', 'u002', 100.00), ('pur03', 'u003', 5.00), ('pur04', 'u003', 80.00);

SELECT * FROM purchases;

ALTER TABLE purchases ADD COLUMN product_description TEXT;

UPDATE purchases
SET
    product_description = 'Descrição do Produto 1'
WHERE id = 'p01';

UPDATE purchases
SET
    product_description = 'Descrição do Produto 2'
WHERE id = 'p02';

SELECT
    p.id AS id_da_compra,
    u.id AS id_de_quem_fez_a_compra,
    u.name AS nome_de_quem_fez_a_compra,
    u.email AS email_de_quem_fez_a_compra,
    p.total_price AS preco_total_da_compra,
    p.created_at AS data_da_compra
FROM purchases AS p
    JOIN users AS u ON p.buyer_id = u.id
WHERE p.id = 'p01';

-- Criando tabela de compradores para usar com INER JOIN

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

DROP TABLE purchases_products;

INSERT INTO
    purchases_products (
        purchase_id,
        product_id,
        quantity
    )
VALUES ('pur01', 'p01', 2), ('pur02', 'p02', 1), ('pur03', 'p03', 1), ('pur04', 'p04', 3);

SELECT
    purchases.id AS id_compra,
    users.id AS id_usuario,
    users.name AS nome_usuario,
    users.email AS email_usuario,
    products.id AS id_produto,
    products.name AS nome_produto,
    products.price AS preco_produto,
    products.description AS descrição_produto,
    purchases_products.quantity AS quantidade_produto,
    purchases.total_price AS preco_total_compra,
    purchases.created_at AS data_da_compra
FROM purchases
    INNER JOIN users ON purchases.buyer_id = users.id
    INNER JOIN purchases_products ON purchases.id = purchases_products.purchase_id
    INNER JOIN products ON purchases_products.product_id = products.id;