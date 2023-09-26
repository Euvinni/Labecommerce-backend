import express, { Request, Response } from "express";
import cors from "cors"
import { TUser, TProduct } from "./types";
import { users, products } from "./dataBase";
import { AnyARecord } from "dns";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});


//Busca por usuário

app.get("/users", (req: Request, res: Response) => {
    try {
        const getAllUsers: TUser[] = users

        if(getAllUsers.length === 0) {
            throw new Error("Nenhum usuário foi encontrado")
        }
        res.status(200).send(getAllUsers)
    } catch (error: any) {
        console.log(error);
        
        if(res.statusCode === 200) {
            res.status(500)
        }
        res.send(error.message)
    }
})

// Busca por produtos 

app.get("/products", (req: Request, res: Response) => {
  try {
    const result: TProduct[] = products;

    res.status(200).send(result);
  } catch (error) {
    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro no produtos");
    }
  }
});

// Procurando produto por query 

app.get("/products/search", (req: Request, res: Response): void => {
  try {
    const query: string = req.query.q as string;

    if (query.length === 0) {
      res.statusCode = 404;
      throw new Error("Query deve possuir pelo menos um caractere");
    }

    const productsByName: TProduct[] = products.filter((product) =>
      product.name.toLowerCase().startsWith(query.toLowerCase())
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
      res.send("Erro: a query deve possuir pelo menos um caractere");
    }
  }
});



// Criando um novo usuário e checando se já existe

app.post("/users", (req: Request, res: Response) => {
    try {

        const {id, name, email, password, createdAt}: TUser = req.body
    
        const checkIdUser = users.find((user)=>user.id === id)
    
        if(checkIdUser) {
            res.statusCode = 400 
            throw new Error ("Esse 'id' já existe em nosso banco de dados")
        }
    
        const checkEmail = users.find((user)=>user.email === email) 
    
        if(checkEmail) {
            res.statusCode = 400 
            throw new Error ("Esse 'email' já existe em nosso banco de dados")
        }
    
        const newUser: TUser = {
            id,
            name,
            email, 
            password, 
            createdAt
        }
    
        users.push(newUser)
        res.status(200).send("Cadastro realizado com sucesso!")
        
    } catch (error: any) {
        console.log(error);
        res.send(error.message)
        
    }

})

// Criando um novo produto 

app.post("/products", (req: Request, res: Response) => {
    try {
      const { id, name, price, description, imageUrl }: TProduct = req.body;
  
      const CheckIdProduct = products.find((product) => product.id === id);
      if (CheckIdProduct) {
        throw new Error(
          "Este 'id' deste produto já existe em nosso banco de dados"
        );
      }
  
      const newProduct: TProduct = {
        id,
        name,
        price,
        description,
        imageUrl,
      };
  
      products.push(newProduct);
  
      res.status(201).send("Produto cadastrado com sucesso!");
    } catch (error: any) {
      console.log(error);
      res.status(400).send(error.message);
    }
  });

// Deletando usuários 

app.delete("/users/:id", (req: Request, res: Response) => {

  try {
    const id = req.params.id
    const indexDelete = users.findIndex((user)=>user.id === id)
    
    if(indexDelete === -1) {
      res.statusCode = 400 
      throw new Error ("Usuário não encontrado!")
    }

    if(indexDelete >= 0) {
        users.splice(indexDelete, 1)
        res.status(200).send("O usuário foi deletado com sucesso!")
    } 

  } catch (error: any) {
      console.log(error);
      res.status(500).send(error.message)
  }
  
})

// Deletando produtos 

app.delete("/products/:id", (req: Request, res: Response) => {

  try {
    const id = req.params.id;
    const indexDelet = products.findIndex((product) => product.id === id);
  
    if(indexDelet === -1) {
      res.statusCode = 400 
      throw new Error ("Produto não encontrado!")
    }

    if (indexDelet >= 0) {
      products.splice(indexDelet, 1);
      res.status(200).send("Produto foi deletado com sucesso!")
    } 
    
  } catch (error: any) {
    res.status(500).send(error.message)
  }

  });

  // Editando produtos 

app.put("/products/:id", (req: Request, res: Response) => {

  try {
    const id = req.params.id;
    const product = products.find((product)=> product.id === id)

    if(!product) {
      res.statusCode = 400
      throw new Error ("Produto não encontrado!")
    }

    const {name, price, description, imageUrl}: TProduct = req.body 
  
    if(typeof name !== "string") {
      res.statusCode = 400 
      throw new Error ("O nome do produto deve ser um texto")
    }

    if(typeof price !== "number") {
      res.statusCode = 400 
      throw new Error ("O preço do produto deve ser um número")
    }
    
    if(typeof description !== "string") {
      res.statusCode = 400 
      throw new Error ("A descrição do produto deve ser um texto")
    }

    if(typeof imageUrl !== "string") {
      res.statusCode = 400 
      throw new Error ("A url do produto deve ser um texto")
    }


        product.name = name || product.name
        product.price = price || product.price
        product.description = description || product.description
        product.imageUrl = imageUrl || product.imageUrl

        
  
    res.status(200).send({ message: "Produto atualizado com sucesso!" });
    
  } catch (error: any) {
    res.status(500).send(error.message)
  }

})

////