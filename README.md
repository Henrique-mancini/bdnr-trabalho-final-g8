# Monitoramento de Séries Temporais e Dados Não-Estruturados: Abordagem Híbrida com TimescaleDB + JSONB

[![TimescaleDB](https://img.shields.io/badge/TimescaleDB-F15A24?style=for-the-badge&logo=timescaledb&logoColor=white)](https://www.timescale.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

## Integrantes do Grupo (Grupo G8)
* Davi da Silva Pereira Maranduba
* Henrique Mancini Malafaia
* Matheus Freesz
* Pedro Henrique Coelho Guerson

## Banco de Dados Escolhido
* **Banco de Dados:** TimescaleDB (Extensão do PostgreSQL otimizada para Time-Series)
* **Paradigma NoSQL Utilizado:** Armazenamento documental semiesquematizado com o tipo de dado nativo **JSONB** e indexação invertida (**GIN**).

---

## Como Executar o Projeto

### Pré-requisitos
* Docker Desktop instalado e em execução.
* Node.js (versão 16 ou superior) instalado localmente.

---

### Passo 1: Inicializar o Banco de Dados (TimescaleDB)
Na pasta raiz do projeto (onde está o arquivo `docker-compose.yml`), execute o comando para iniciar o container do banco de dados em segundo plano:
```bash
docker compose up -d
```
O container baixará a imagem do TimescaleDB baseada no PostgreSQL 14 e executará automaticamente o script de inicialização `db/init.sql`. Esse script criará as tabelas `estacoes_meteorologicas` e `leituras_clima` (Hypertable particionada por tempo), o índice GIN no campo `dados_payload`, e inserirá dados fictícios de teste.

---

### Passo 2: Inicializar o Servidor Backend (Express API)
1. Navegue até o diretório `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências necessárias do Node.js:
   ```bash
   npm install
   ```
3. Inicialize o servidor da API:
   ```bash
   npm start
   ```
O servidor será executado na porta 3000: `http://localhost:3000`.

---

## Roteiro de Testes da API (Rotas e Consultas)

Abra um terminal separado para executar os comandos `curl` abaixo e validar o funcionamento da aplicação.

### 1. Inserir uma Nova Leitura (Create)
Insere uma nova telemetria climática no banco.
```bash
curl -X POST http://localhost:3000/api/sensor/leituras \
  -H "Content-Type: application/json" \
  -d '{
    "id_estacao": "EST_JF_01",
    "dados_payload": {
      "temperatura": 19.5,
      "umidade": 88,
      "eventos_climaticos": ["garoa"],
      "condicoes_externas": {
        "vento_kmh": 8,
        "indice_uv": 0
      }
    }
  }'
```

### 2. Listar Leituras Cadastradas (Read)
Retorna todas as telemetrias salvas, ordenadas das mais recentes para as mais antigas.
```bash
curl http://localhost:3000/api/sensor/leituras
```

### 3. Atualizar uma Leitura Existente (Update)
Atualiza a telemetria correspondente ao ID especificado na URL (substitua o número `1` pelo ID desejado).
```bash
curl -X PUT http://localhost:3000/api/sensor/leituras/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id_estacao": "EST_JF_01",
    "dados_payload": {
      "temperatura": 20.0,
      "umidade": 85,
      "eventos_climaticos": []
    }
  }'
```

### 4. Remover uma Leitura (Delete)
Deleta fisicamente uma leitura com base no ID (substitua o número `1` pelo ID correspondente).
```bash
curl -X DELETE http://localhost:3000/api/sensor/leituras/1
```

---

## Consultas Complexas Requeridas pelo Trabalho

### Consulta Complexa 1: Relatório de Eventos com JOIN (Lookup), Desestruturação de Array (Unwind) e Filtro (Match)
Esta rota cruza dados da tabela cadastral relacional de estações com o payload documental JSONB das leituras, divide arrays internos de eventos em linhas separadas e filtra por temperatura.
* **Filtro opcional de temperatura mínima:** `?temp=21.0` (padrão é 20.0).
```bash
curl "http://localhost:3000/api/sensor/relatorio-eventos?temp=21.0"
```

### Consulta Complexa 2: Agrupamento Temporal (Time Bucket) e Agregação de Subdocumentos (Group)
Esta rota usa funções analíticas do TimescaleDB para agrupar dados cronologicamente e calcular a temperatura média e velocidade máxima do vento (no interior do objeto aninhado JSONB).
* **Intervalo de agrupamento customizável:** `?intervalo=10+minutes` (padrão é 5 minutos).
```bash
curl "http://localhost:3000/api/sensor/media-temporal?intervalo=10+minutes"
```
