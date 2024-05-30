const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true })); // para parsear o corpo das requisições POST

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html');
});

let users = {}; // objeto para armazenar os dados dos usuários

app.post('/register', (req, res) => {
  const { name, email, password, confirm_password } = req.body;
  if (password !== confirm_password) {
    res.send(`
      <p>A confirmação da senha está diferente da senha inserida. Por favor, tente novamente.</p>
      <a href="/register"><button>Voltar ao Cadastro</button></a>
    `);
  } else {
    users[email] = { name, password };
    console.log(users);
    res.send(`
      <p>Dados recebidos. Obrigado pelo cadastro!</p>
      <a href="/"><button>Voltar à Página Inicial</button></a>
    `);
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.send('Por favor, insira o login e a senha. <p><a href="/"><button>Voltar</button>');
  } else if (users[email] && users[email].password === password) {
    res.send('Login realizado com sucesso!');
  } else {
    res.send('<p>Login ou senha inválidos.</p><a href="/"><button>Voltar</button></a>');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
