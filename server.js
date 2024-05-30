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
  const { name, email, password, confirm_password } = req.body; // extrai name, email, password e confirm_password do corpo da requisição
  if (password !== confirm_password) {
    res.send(`
      <p>A confirmação da senha está diferente da senha inserida. Por favor, tente novamente.</p>
      <a href="/register"><button>Voltar ao Cadastro</button></a>
    `);
  } else {
    users[email] = { name, password }; // armazena os dados do usuário no objeto users
    console.log(users); // imprime o objeto users no console
    res.send(`
      <p>Dados recebidos. Obrigado pelo cadastro!</p>
      <a href="/"><button>Voltar à Página Inicial</button></a>
    `);
  }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body; // extrai email e password do corpo da requisição
    // Aqui você pode adicionar o código para verificar se o email e a senha correspondem a um usuário cadastrado
    res.send('Login realizado com sucesso!');
  });


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
