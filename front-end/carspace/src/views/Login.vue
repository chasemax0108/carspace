<template>
    <div class="page">
        <div class="user-forms" v-if="!user">
            <form class="reglogin-form" @submit.prevent="register()">
                <h1>Register a New User</h1>
                <div class="reglogin-fields">
                    <label>First Name:</label><input v-model="first_name">
                    <label>Last Name:</label><input v-model="last_name">
                </div>
                <div class="reglogin-fields">
                    <label>Username:</label><input v-model="new_username">
                    <label>Password:</label><input v-model="new_password" type="password">
                </div>
                <input class="reglogin-button" type="submit" value="Register">
            </form>
            <form class="reglogin-form" @submit.prevent="login()">
                <h1>Login</h1>
                <div class="reglogin-fields">
                    <label>Username:</label><input v-model="username">
                    <label>Password:</label><input v-model="password" type="password">
                </div>
                <input class="reglogin-button" type="submit" value="Log In">
            </form>
        </div>
        <div class="reglogin-form" v-if="user">
            <h2>You are currently logged in as: {{user.firstName}} {{user.lastName}}</h2>
            <button class="reglogin-button" @click="logout()">Logout</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Login',
    data () {
        return {
            first_name: null,
            last_name: null,
            new_username: null,
            new_password: null,
            username: null,
            password: null
        }
    },
    computed: {
        user() {
            return this.$root.$data.user;
        }
    },
    methods: {
        async register() {
            // TODO: Add error codes and uncomment
            /*
            this.error = '';
            this.errorLogin = '';
            */
           if (!this.first_name || !this.last_name || !this.new_username || !this.new_password) {
               return;
           }
           try {
               let response = await axios.post('/api/users', {
                   firstName: this.first_name,
                   lastName: this.last_name,
                   username: this.new_username,
                   password: this.new_password,
               });
               this.$root.$data.user = response.data.user;
           } catch (error) {
               //this.error = error.response.data.message;
               this.$root.$data.user = null;
           }
        },
        async login() {
            // TODO: Add error codes and uncomment
            /*
            this.error = '';
            this.errorLogin = '';
            */
           if (!this.username || !this.password) {
               return;
           }
           try {
               let response = await axios.post('/api/users/login', {
                   username: this.username,
                   password: this.password
               });
               this.$root.$data.user = response.data.user;
           } catch (error) {
               //this.errorLogin = "Error: " + error.response.data.message;
               this.$root.$data.user = null;
           }
        },
        async logout() {
            try {
                await axios.delete('/api/users');
                this.$root.$data.user = null;
            } catch (error) {
                this.$root.$data.user = null;
            }
        },
    }
}
</script>

<style>
.reglogin-form {
    text-align: center;
    background-color: #DBE8E1;
    margin-bottom: 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
}

.reglogin-fields{
    margin-top: 10px;
    display: flex;
    justify-content: space-evenly;
}

.reglogin-button {
    margin-top: 10px;
    background-color: #E10032;
    width: 100px;
    align-self: center;
    color: white;
}

</style>
