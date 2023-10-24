import express, { Request, Response } from "express";
import cors from "cors"
import { TUser, TProduct } from "./types";;
import { db } from "./dataBase/knex";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.status(200).send("Pong!");
});


//Busca por usuário

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await db.select("*").from("users");

    if (users.length === 0) {
      throw new Error("Erro de solicitação de usuário");
    }

    res.status(200).send(users);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    }
  }
});

// Criando um novo usuário e checando se já existe

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, name, email, password}: TUser = req.body;

    const [userId] = await db.raw(
      
    `SELECT id
    FROM users
    WHERE id = ?;
    `,
      [id]
    );

    if (userId && userId.length > 0) {
      res.statusCode = 400;
      throw new Error("Este 'id' já existe em nosso banco de dados");
    }

    const [existingEmail] = await db.raw(
      
    `SELECT email
    FROM users
    WHERE email = ?;
    `,
      [email]
    );

    if (existingEmail && existingEmail.length > 0) {
      res.statusCode = 400;
      throw new Error("Este 'e-mail' já existe em nosso banco de dados");
    }

    await db.raw(
      
      `INSERT INTO users (id, name, email, password)
      VALUES (?, ?, ?, ?);
    `,
      [id, name, email, password]
    );

    res.status(201).send("Cadastro realizado");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Deletando usuários 
  
app.delete("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const userExists = await db.select().from("users").where("id", id);

    if (userExists.length === 0) {
      res.status(404).send({ message: `Não existe uma conta com o id ${id}` });
      return;
    }

    await db("users").where("id", id).del();

    res.status(200).send({ message: "O usuário foi deletado com sucesso" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(400).send(`Erro ao deletar usuário: ${error}`);
  }
});




// Busca por produtos 

app.get("/products", async (req: Request, res: Response) => {
  try {
    const products = await db.select("*").from("products");

    res.status(200).send(products);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ error: error.message });
    } else {
      res
        .status(500)
        .send({ error: "Erro de solicitação de produto" });
    }
  }
});

// Editando produtos 

app.put("/product/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { name, price, description, image_Url }: TProduct = req.body;

    const [productId] = await db.raw("SELECT * FROM products WHERE id = ?", [id]);

    if (productId && productId.length === 0) {
      res.statusCode = 404;
      throw new Error("O produto não foi encontrado");
    }

    if (name && name?.length === 0) {
      res.statusCode = 400;
      throw new Error("O nome deve ter no mínimo 1 caractere");
    }
    if (typeof price === "number" && price < 0 && price !== undefined) {
      res.statusCode = 400;
      throw new Error("O preço deve ser um número e deve ser maior que 0");
    }

    if (description && description.length === 0) {
      res.statusCode = 400;
      throw new Error("A descrição deve conter ao menos 1 caractere");
    }
    if (typeof image_Url !== "string") {
      res.statusCode = 400;
      throw new Error("A URL do produto deve ser um texto");
    }

    const [newProduct] = await db.raw(
      `SELECT * FROM products WHERE id = "${id}"`
    );

    if (newProduct) {
      await db.raw(`
      UPDATE products SET
      name = "${name || newProduct.name}",
      price = "${price || newProduct.price}",
      description = "${description || newProduct.description}",
      image_Url = "${image_Url || newProduct.image_Url}"
      WHERE id = "${id}"
      `);
    }

    res.status(200).send({ message: "Produto atualizado" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Procurando produto por query 

app.get("/products/search", async (req, res) => {
  try {
    const query: string = req.query.q as string;

    if (query.length === 0) {
      res.statusCode = 404;
      throw new Error("Query deve possuir pelo menos um caractere");
    }

    const productsByName: TProduct[] = await db("products").where(
      "name",
      "like",
      `%${query}%`
    );

    if (productsByName.length === 0) {
      res.statusCode = 404;
      throw new Error(`Nenhum produto encontrado para a query "${query}"`);
    }

    res.status(200).send(productsByName);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro na solicitação");
    }
  }
});

// Criando um novo produto 

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, description, image_Url }: TProduct = req.body;

    const [productId] = await db.raw(
      `
      SELECT id
      FROM products
      WHERE id = ?;
    `,
      [id]
    );

    if (productId > 0) {
      res.statusCode = 400;
      throw new Error('Este "id" já existe em nosso banco de dados');
    }

    await db.raw(`
      INSERT INTO products (id, name, price, description, image_Url)
      VALUES ("${id}", "${name}", "${price}", "${description}", "${image_Url}")`);

    res.status(201).send("O produto foi cadastrado");
  } catch (error: any) {
    res.status(400).send(error.message);
  }
});
  
// Deletando produtos 

app.delete("/product/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const [product] = await db.raw("SELECT * FROM products WHERE id = ?", [id]);

    if (product.length === 0) {
      res.statusCode = 400;
      throw new Error(
        'Produto nãp encontrado'
      );
    }

    await db.raw("DELETE FROM products WHERE id = ?", [id]);

    res.status(200).send({ message: "O produto foi deletado com sucesso" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

// Cadastrando uma nova compra
app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, buyer_id, total_price } = req.body;

    if (typeof id !== "string" || id.length < 4) {
      res.statusCode = 404;
      throw new Error('O campo "id" é obrigatório');
    }

    if (typeof buyer_id !== "string" || buyer_id.length < 3) {
      res.statusCode = 404;
      throw new Error('O campo do "buyer id" é obrigatório');
    }

    if (typeof total_price !== "number" || total_price <= 1) {
      res.statusCode = 404;
      throw new Error('O campo do "preço" é obrigatório');
    }

    const isPurchase = await db.raw(`INSERT INTO purchases
    (id, buyer_id, total_price)
    VALUES("${id}", "${buyer_id}", "${total_price}")
    `);

    res.status(200).send("O produto foi cadastrado");
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    }
  }
});

// Retornando os dados de uma compra
app.get('/purchases/:id', async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id as string;

    const [purchaseId] = await db.raw(
      'SELECT * FROM purchases WHERE id = ?',
      [id]
    );

    if (!purchaseId || purchaseId.length === 0) {
      throw new Error(
        'Nenhuma compra foi encontrada com este "id"'
      );
    }

    const userDataBuyer = await db.raw(`
      SELECT
        purchases.id AS purchaseId,
        purchases.buyer_id AS buyerId,
        users.name AS buyerName,
        users.email AS buyerEmail,
        purchases.total_price AS totalPrice,
        purchases.created_at AS createdAt
      FROM purchases
      INNER JOIN users ON purchases.buyer_id = users.id
      WHERE purchases.id = ?
    `, [id]);

    const products = await db.raw(`
      SELECT
        purchases_products.product_id AS id,
        products.name,
        products.price,
        products.description,
        products.image_Url,
        purchases_products.quantity
      FROM purchases_products
      INNER JOIN products ON products.id = purchases_products.product_id
      WHERE purchases_products.purchase_id = ?
    `, [id]);

    const result = {
      ...userDataBuyer[0][0],
      products: products[0],
    };

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    if (req.statusCode === 200) {
      res.status(500);
    }
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send('Erro inesperado');
    }
  }
});

// Deletando um pedido existente
app.delete("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const purchase = await db("purchases").where("id", id).first();

    if (!purchase) {
      res.status(404).send({ error: 'Compra não encontrada' });
      return;
    }

    await db("purchases").where("id", id).del();

    res.status(200).send({ message: 'A compra foi excluída com sucesso' });
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
});


