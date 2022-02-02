<template>
  <div class="users">
    <div class="container">
      <section>
        <h5 class="title">Novo usuário</h5>
        <!-- Diretriz para escutar um evento do tipo 'submit', utilizando o prevent para prevenir que o navegador faça o realod da página, por fim passando o método utilizado para a criação dos usuários  -->
        <form v-on:submit.prevent="createUser">
          <!-- Diretiva 'v-model' => Não só realiza uma associação de dados do HTML para o JavaScript, ela atua como uma Two Way Databind, uma associação de dados bidirecional-->
          <input type="text" placeholder="Nome Completo" v-model="form.name" />
          <input type="text" placeholder="E-mail" v-model="form.email" />
          <button type="submit">Adicionar usuário</button>
        </form>
      </section>
      <section>
        <h4 class="title">Lista de Usuários</h4>
        <ul>
          <li v-for="user in users" :key="user.id">
            <p>{{ user.name }}</p>
            <small>{{ user.email }}</small>
            <a class="destroy" @click="destroyUser(user.id)"></a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from '@/utils/axios'

interface User {
  id: string
  email: string
  name: string
}

export default defineComponent({
  data() {
    return {
      users: [] as User[],
      form: {
        name: '',
        email: ''
      }
    }
  },
  created() {
    this.fetchUsers()
  },
  methods: {
    // O async "acompanha" o await utilizado logo abaixo
    async fetchUsers() {
      try {
        const { data } = await axios.get('/users')
        this.users = data
      } catch (error) {
        console.warn(error)
      }
      // await = utilizado pois a requisição é assíncrona
    },
    async createUser() {
      try {
        const { data } = await axios.post('/users', this.form)

        this.users.push(data)

        this.form = {
          name: '',
          email: ''
        }
      } catch (error) {
        console.warn(error)
      }
    },
    async destroyUser(id: User['id']) {
      try {
        await axios.delete(`/users/${id}`)

        const userIndex = this.users.findIndex((user) => user.id === id)

        this.users.splice(userIndex, 1)
      } catch (error) {
        console.warn(error)
      }
    }
  }
})
</script>

<style scoped>
.container {
  margin: 4rem auto;
  max-width: 500px;
  width: 90%;
  display: grid;
  grid-gap: 2.5rem;
}

.title {
  font-size: 1rem;
  font-weight: 500;
  margin: 0.7rem 0;
}

form {
  display: grid;
  grid-gap: 1rem;
}

input {
  background: transparent;
  border: 1px solid #999fc6;
  border-radius: 1rem;
  padding: 0.6rem;
  outline: none;
  color: #e1e8ef;
}

input::placeholder {
  color: #999fc6;
}

button {
  background-color: #2d6cea;
  color: #e1e8ef;
  border: none;
  border-radius: 1rem;
  padding: 0.6rem 1.5rem;
  width: max-content;
  transition: all 0.3s linear;
  outline: none;
  cursor: pointer;
  box-shadow: 0 0 5px 3px rgba(45, 108, 234, 0.3);
}

button:hover {
  background-color: #1b5cdc;
}

p {
  margin: 0;
}

ul {
  padding: 0;
  margin: 0;
  display: grid;
  grid-gap: 1rem;
}

li {
  background-color: #2b3a4e;
  padding: 1.2rem 1rem;
  border-radius: 1rem;
  position: relative;
  list-style: none;
  color: #8b98a8;
}

.destroy {
  background-color: #d53e6b;
  width: 24px;
  height: 24px;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s linear;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 1.3rem;
}

.destroy:before,
.destroy:after {
  content: '';
  width: 3px;
  height: 13px;
  background-color: #ececf6;
  border-radius: 1rem;
  position: absolute;
  top: 50%;
  left: 50%;
}

.destroy:before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.destroy:after {
  transform: translate(-50%, -50%) rotate(130deg);
}

.destroy:hover {
  background-color: #984848;
}
</style>
