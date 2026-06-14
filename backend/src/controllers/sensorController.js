const db = require('../database');

const listarLeituras = async (req, res) => {
  try {
    const resultado = await db.query(
      'SELECT * FROM leituras_clima ORDER BY data_leitura DESC'
    );

    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const criarLeitura = async (req, res) => {
  try {
    const { cidade, dados_payload } = req.body;

    const resultado = await db.query(
      `INSERT INTO leituras_clima
      (cidade, dados_payload)
      VALUES ($1, $2)
      RETURNING *`,
      [cidade, dados_payload]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

module.exports = {
  listarLeituras,
  criarLeitura
};