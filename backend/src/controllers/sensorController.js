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

const atualizarLeitura = async (req, res) => {
  try {
    const { id } = req.params;
    const { cidade, dados_payload } = req.body;

    const resultado = await db.query(
      `UPDATE leituras_clima
       SET cidade = $1, dados_payload = $2
       WHERE id = $3
       RETURNING *`,
      [cidade, dados_payload, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: 'Leitura não encontrada'
      });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const deletarLeitura = async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await db.query(
      `DELETE FROM leituras_clima
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        erro: 'Leitura não encontrada'
      });
    }

    res.json({
      mensagem: 'Leitura removida com sucesso',
      leitura: resultado.rows[0]
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

module.exports = {
  listarLeituras,
  criarLeitura,
  atualizarLeitura,
  deletarLeitura
};