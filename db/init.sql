-- Habilitar a extensão do TimescaleDB no banco atual
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Criar tabela relacional
CREATE TABLE estacoes_meteorologicas (
    id_estacao VARCHAR(50) PRIMARY KEY,
    nome_estacao VARCHAR(100) NOT NULL,
    modelo_sensor VARCHAR(50),
    altitude_metros INT,
    cidade VARCHAR(100) NOT NULL
);

-- Criar tabela de telemetria
CREATE TABLE leituras_clima (
    id SERIAL,
    id_estacao VARCHAR(50) NOT NULL,
    data_leitura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dados_payload JSONB NOT NULL,
    PRIMARY KEY (id, data_leitura),
    CONSTRAINT fk_estacao FOREIGN KEY (id_estacao) REFERENCES estacoes_meteorologicas(id_estacao) ON DELETE CASCADE
);

-- Converter em hypertable
SELECT create_hypertable('leituras_clima', 'data_leitura');

-- Indexar JSONB
CREATE INDEX idx_leituras_payload ON leituras_clima USING GIN (dados_payload);

-- Inserir dados de teste (Sementes)
INSERT INTO estacoes_meteorologicas (id_estacao, nome_estacao, modelo_sensor, altitude_metros, cidade) VALUES
('EST_JF_01', 'Estação Central Juiz de Fora', 'DHT22-Pro', 678, 'Juiz de Fora'),
('EST_TR_02', 'Estação Leste Três Rios', 'BME280-Max', 269, 'Três Rios');

INSERT INTO leituras_clima (id_estacao, data_leitura, dados_payload) VALUES
('EST_JF_01', NOW() - INTERVAL '30 minutes', '{"temperatura": 22.4, "umidade": 75, "eventos_climaticos": ["nevoeiro"], "condicoes_externas": {"indice_uv": 1, "vento_kmh": 12}}'),
('EST_JF_01', NOW() - INTERVAL '15 minutes', '{"temperatura": 23.1, "umidade": 70, "eventos_climaticos": [], "condicoes_externas": {"indice_uv": 2, "vento_kmh": 10}}'),
('EST_TR_02', NOW() - INTERVAL '10 minutes', '{"temperatura": 28.5, "umidade": 55, "eventos_climaticos": ["ventania"], "condicoes_externas": {"indice_uv": 5, "vento_kmh": 28}}'),
('EST_TR_02', NOW(), '{"temperatura": 27.0, "umidade": 58, "eventos_climaticos": ["chuva_leve", "trovoada"], "condicoes_externas": {"indice_uv": 3, "vento_kmh": 15}}');