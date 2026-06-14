const express = require('express');
const router = express.Router();

const {
  listarLeituras,
  criarLeitura,
  atualizarLeitura,
  deletarLeitura
} = require('./controllers/sensorController');

router.get('/leituras', listarLeituras);
router.post('/leituras', criarLeitura);
router.put('/leituras/:id', atualizarLeitura);
router.delete('/leituras/:id', deletarLeitura);

module.exports = router;