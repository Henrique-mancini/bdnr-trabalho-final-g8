const express = require('express');
const router = express.Router();
const sensorController = require('./controllers/sensorController');

router.get('/api/sensor/leituras', sensorController.listarLeituras);
router.post('/api/sensor/leituras', sensorController.criarLeitura);
router.put('/api/sensor/leituras/:id', sensorController.atualizarLeitura);
router.delete('/api/sensor/leituras/:id', sensorController.deletarLeitura);

router.get('/api/sensor/relatorio-eventos', sensorController.obterRelatorioEventos);
router.get('/api/sensor/media-temporal', sensorController.obterMediaTemporal);

module.exports = router;