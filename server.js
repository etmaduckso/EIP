require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const Web3 = require('web3');
const app = express();
const port = process.env.PORT || 3000;

// Conectando à rede Ethereum
const web3 = new Web3(`https://optimism-mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);

// Substitua <username>, <password> e <your-cluster-url> pelas suas credenciais e URL do cluster
const uri = "mongodb+srv://lake:j5MmLYA4G5NzNV4g@cluster0.9adjqij.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri);

app.use(express.urlencoded({ extended: true })); // para parsear o corpo das requisições POST

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

app.get('/welcome', (req, res) => {
  res.sendFile(__dirname + '/welcome.html');
});

let users = {}; // objeto para armazenar os dados dos usuários

app.post('/register', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    res.send(`
      <p>A confirmação da senha está diferente da senha inserida. Por favor, tente novamente.</p>
      <a href="/register"><button>Voltar ao Cadastro</button></a>
    `);
  } else {
    // Verifica se o usuário já existe
    const existingUser = await client.db("test").collection("users").findOne({ email });
    if (existingUser) {
      res.send(`
        <p>Este email já está cadastrado. Por favor, tente fazer login ou use outro email.</p>
        <a href="/"><button>Voltar ao Login</button></a>
      `);
    } else {
      await client.db("test").collection("users").insertOne({ name, email, password });
      res.send(`
        <p>Dados recebidos. Obrigado pelo cadastro!</p>
        <a href="/"><button>Voltar à Página Inicial</button></a>
      `);
    }
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await client.db("test").collection("users").findOne({ email });
  if (user && user.password === password) {
    res.redirect('/welcome');
  } else {
    res.send(`
      <p>Email ou senha incorretos. Por favor, tente novamente.</p>
      <a href="/"><button>Voltar ao Login</button></a>
    `);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
