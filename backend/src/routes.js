const express = require('express');
const router = express.Router();

const {
  listarLeituras,
  criarLeitura
} = require('./controllers/sensorController');

router.get('/leituras', listarLeituras);
router.post('/leituras', criarLeitura);

module.exports = router;