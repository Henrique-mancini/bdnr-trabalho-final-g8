CREATE TABLE leituras_clima (
    id SERIAL,
    cidade VARCHAR(100) NOT NULL,
    data_leitura TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dados_payload JSONB NOT NULL,
    PRIMARY KEY (id, data_leitura)
);

SELECT create_hypertable('leituras_clima', 'data_leitura');

INSERT INTO leituras_clima (cidade, data_leitura, dados_payload) VALUES
('Juiz de Fora', NOW() - INTERVAL '30 minutes', '{"temperatura": 22.4, "umidade": 75, "eventos_climaticos": ["nevoeiro"], "condicoes_externas": {"indice_uv": 1, "vento_kmh": 12}}'),
('Juiz de Fora', NOW() - INTERVAL '15 minutes', '{"temperatura": 23.1, "umidade": 70, "eventos_climaticos": [], "condicoes_externas": {"indice_uv": 2, "vento_kmh": 10}}'),
('Três Rios', NOW() - INTERVAL '10 minutes', '{"temperatura": 28.5, "umidade": 55, "eventos_climaticos": ["ventania"], "condicoes_externas": {"indice_uv": 5, "vento_kmh": 28}}'),
('Três Rios', NOW(), '{"temperatura": 27.0, "umidade": 58, "eventos_climaticos": ["chuva_leve", "trovoada"], "condicoes_externas": {"indice_uv": 3, "vento_kmh": 15}}');