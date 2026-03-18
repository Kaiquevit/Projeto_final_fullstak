const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 segredo JWT (melhor prática)
const SECRET = "meuSegredoSuperSeguro123";

// 🔌 conexão com banco
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "signup"
});

db.connect((err) => {
  if (err) {
    console.log("❌ Erro ao conectar no banco");
  } else {
    console.log("✅ Conectado ao MySQL");
  }
});


// 🔐 CADASTRO
app.post('/signup', (req, res) => {

  const { nome, email, senha } = req.body;

  const checkSql = "SELECT * FROM login WHERE email = ?";

  db.query(checkSql, [email], async (err, result) => {

    if (err) {
      return res.status(500).json({ error: "Erro no servidor" });
    }

    if (result.length > 0) {
      return res.status(400).json({ error: "Email já cadastrado" });
    }

    try {
      const hash = await bcrypt.hash(senha, 10);

      const sql = "INSERT INTO login (name, email, senha) VALUES (?, ?, ?)";

      db.query(sql, [nome, email, hash], (err, data) => {

        if (err) {
          // 🔥 trata erro de email duplicado (garantia extra)
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Email já existe" });
          }

          return res.status(500).json({ error: "Erro ao cadastrar" });
        }

        return res.json({ message: "Usuário cadastrado!" });
      });

    } catch (error) {
      return res.status(500).json({ error: "Erro ao criptografar senha" });
    }

  });

});


// 🔑 LOGIN
app.post('/login', (req, res) => {

  const sql = "SELECT * FROM login WHERE email = ?";

  db.query(sql, [req.body.email], async (err, data) => {

    if (err) return res.status(500).json({ error: "Erro no servidor" });

    if (data.length === 0) {
      return res.status(401).json({ error: "Usuário não existe" });
    }

    const user = data[0];

    try {
      const match = await bcrypt.compare(req.body.senha, user.senha);

      if (!match) {
        return res.status(401).json({ error: "Senha incorreta" });
      }

      // 🔐 gera token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        message: "Login sucesso!",
        token: token
      });

    } catch (error) {
      return res.status(500).json({ error: "Erro ao validar senha" });
    }

  });

});


// 🛡️ MIDDLEWARE
function verifyToken(req, res, next) {

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ error: "Token necessário" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.user = decoded;
    next();
  });
}


// 🔒 ROTA PROTEGIDA
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: "Acesso permitido",
    user: req.user
  });
});


// 🚀 servidor
app.listen(8081, () => {
  console.log("🚀 Servidor rodando na porta 8081");
});