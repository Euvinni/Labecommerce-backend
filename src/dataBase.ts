import { TUser, TProduct } from './types'

export const users: TUser[] = [

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

]

  export const createUser = (id: string, name: string, email: string, password: string):string => {

    const createdAt = new Date().toISOString()

    const newUser: TUser = { 
        id: id,
        name: name,
        email: email,
        password: password,
        createdAt: createdAt
    }

    users.push(newUser)

    return "Cadastro realizado com sucesso"

  } 

  export const getAllUsers = ():TUser[] => {

    return users

  }


export const products: TProduct[] = [

    {
        id: 'prod001',
        name: 'Mouse gamer',
        price: 250,
        description: 'Melhor mouse do mercado',
        imageUrl: 'https://picsum.photos/seed/Mouse%20gamer/400',
    },
    {
        id: 'prod002',
        name: 'Monitor',
        price: 900,
        description: 'Monitor LED Full HD 24 polegadas',
        imageUrl: 'https://picsum.photos/seed/Monitor/400',
    },

]

export const createProduct = (id: string, name: string, price: number, description: string, imageUrl: string):string => {

    const newProduct: TProduct = { 
        id: id,
        name: name,
        price: price,
        description: description,
        imageUrl: 'https://picsum.photos/seed/Monitor/400',
    }

    products.push(newProduct)

    return "Produto criado com sucesso"

  } 

  export const getAllProduct = ():TProduct[] => {

    return products

  }

  export const searchProductsByName = (name: string):TProduct[] => {

    const filterProducts = products.filter((product)=>{
        return product.name.toLowerCase().includes(name.toLowerCase())
    })
    
    return filterProducts
  }