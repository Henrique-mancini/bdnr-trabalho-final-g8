const db = require('../database');

const listarLeituras = async (req, res) => {
  try {
    const query = 'SELECT * FROM leituras_clima ORDER BY data_leitura DESC';
    const resultado = await db.query(query);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const criarLeitura = async (req, res) => {
  try {
    const { id_estacao, dados_payload } = req.body;
    
    const query = `
      INSERT INTO leituras_clima (id_estacao, dados_payload)
      VALUES ($1, $2)
      RETURNING *`;
    const valores = [id_estacao, typeof dados_payload === 'object' ? JSON.stringify(dados_payload) : dados_payload];
    const resultado = await db.query(query, valores);
    
    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const atualizarLeitura = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_estacao, dados_payload } = req.body;
    
    const query = `
      UPDATE leituras_clima
      SET id_estacao = $1, dados_payload = $2
      WHERE id = $3
      RETURNING *`;
    const valores = [id_estacao, typeof dados_payload === 'object' ? JSON.stringify(dados_payload) : dados_payload, id];
    const resultado = await db.query(query, valores);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Leitura não encontrada' });
    }
    res.json(resultado.rows[0]);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const deletarLeitura = async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM leituras_clima WHERE id = $1 RETURNING *';
    const resultado = await db.query(query, [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Leitura não encontrada' });
    }
    res.json({
      mensagem: 'Leitura removida com sucesso!',
      registroRemovido: resultado.rows[0]
    });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const obterRelatorioEventos = async (req, res) => {
  try {
    const tempLimite = req.query.temp || 20.0;
    const query = `
      SELECT 
          e.nome_estacao,
          e.cidade,
          (l.dados_payload->>'temperatura')::numeric AS temperatura,
          jsonb_array_elements_text(l.dados_payload->'eventos_climaticos') AS evento_detectado
      FROM leituras_clima l
      JOIN estacoes_meteorologicas e ON l.id_estacao = e.id_estacao
      WHERE (l.dados_payload->>'temperatura')::numeric > $1;
    `;
    const resultado = await db.query(query, [tempLimite]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

const obterMediaTemporal = async (req, res) => {
  try {
    const intervalo = req.query.intervalo || '5 minutes';
    const query = `
      SELECT 
          time_bucket($1::interval, l.data_leitura) AS intervalo_tempo,
          e.cidade,
          ROUND(AVG((l.dados_payload->>'temperatura')::numeric), 2) AS temp_media,
          MAX((l.dados_payload->'condicoes_externas'->>'vento_kmh')::numeric) AS vento_maximo
      FROM leituras_clima l
      JOIN estacoes_meteorologicas e ON l.id_estacao = e.id_estacao
      GROUP BY intervalo_tempo, e.cidade
      ORDER BY intervalo_tempo DESC;
    `;
    const resultado = await db.query(query, [intervalo]);
    res.json(resultado.rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
};

module.exports = {
  listarLeituras,
  criarLeitura,
  atualizarLeitura,
  deletarLeitura,
  obterRelatorioEventos,
  obterMediaTemporal
};