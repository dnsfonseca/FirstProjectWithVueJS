import express from 'express'

// CORS => Cross-Origin Resource Sharing ou CORS é um mecanismo que permite que recursos restritos em uma página da web sejam recuperados por outro domínio fora do domínio ao qual pertence o recurso que será recuperado.
import cors from 'cors'

// Para a criação do ID único, foi instalado a biblioteca UUID. 1º Comando -> npm install uuid 2º Comando -> npm install @types/uuid -D (dependência como dev)
//Foi atribuído um "apelido" para v4, visando uma melhor sintaxe
import { v4 as uuid } from 'uuid'
const app = express()

app.use(express.json())

// Abaixo é configurado quais endereços podem ter acesso a esse ambiente (back end)
// => '*' qualquer endereço pode acessá-lo
// Caso seja necessário maior segurança, insira o domínio do frontend, desde modo o acesso estará sendo restritivo
app.use(cors({ origin: '*' }))

//Como a linguagem utilizada é TS (baseada em JS) foi criado uma interface para armazenar as variáveis.
interface User {
  id: string
  name: string
  email: string
}

// A variável users é do tipo User, que será uma array
const users: User[] = []

app.get('/users', (request, response) => {
  //Retorna os usuários do array users
  return response.json(users)
})

app.post('/users', (request, response) => {
  // Recebe os dados do novo usuário. Não passando o ID, pois esta variável deve ser criada pelo back end.
  // request.body => pois o valor das variáveis vem do corpo da requisição
  const { name, email } = request.body

  // Com base nas informações acima, o usuário será criado.
  const user = { id: uuid(), name, email }

  //Função para inserir um novo valor na array. Ou seja, um novo usuário será enviado para a base de dados
  users.push(user)

  //Por fim, é retornado os dados do usuário cadastrado
  return response.json(user)
})

// Para a atualização de um dado de um usuário, é necessário trabalhar com o ID
// Por isto é inserido o /:id na rota
app.put('/users/:id', (request, response) => {
  // Recebe o ID do usuário através do params da rota
  const { id } = request.params
  // Recebe o ID da rota através do body da requisição
  const { name, email } = request.body

  // O Index do item é utilizado para encontrar o valor em um array, comparando o ID da lista com o ID da requisição
  const userIndex = users.findIndex(user => user.id === id)

  // Condição que trata se o usuário existe na base de dados, retornando o status e descrição de erro
  if (userIndex < 0) {
    return response.status(404).json({ error: 'User not found!' })
  }

  const user = { id, name, email }

  // A base de dados receberá os valores inseridos na variável userIndex que fora alterados
  users[userIndex] = user

  //Por fim, é retornado os dados do usuário alterado
  return response.json(user)
})

// Para a exclusão de um usuário, é necessário trabalhar com o ID
// Por isto é inserido o /:id na rota
app.delete('/users/:id', (request, response) => {
  // Recebe o ID da rota através do body da requisição
  const { id } = request.params

  // O Index do item é utilizado para encontrar o valor em um array, comparando o ID da lista com o ID da requisição
  const userIndex = users.findIndex(user => user.id === id)

  // Condição que trata se o usuário existe na base de dados, retornando o status e descrição de erro
  if (userIndex < 0) {
    return response.status(404).json({ error: 'User not found!' })
  }

  // Função para exclusão do usuário com o ID apontado na requisição uma única vez
  users.splice(userIndex, 1)

  // Retorna se a requisição foi completada com sucesso
  return response.status(200).send().json({ message: 'User deleted!' })
})

app.listen('3333', () => {
  console.log('Back-end Started')
})
