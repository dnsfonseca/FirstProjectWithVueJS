// O AXIOS é uma biblioteca que realiza requisições HTTP para uma API
import axios from 'axios'

// Instância personalizada do AXIOS que faz um direcionamento padrão para a URL informada.
export default axios.create({
  baseURL: 'http://localhost:3333'
})
