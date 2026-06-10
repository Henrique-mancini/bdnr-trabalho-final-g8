# Estação Meteorológica Doméstica (Monitoramento Climático Time-Series)

[![TimescaleDB](https://img.shields.io/badge/TimescaleDB-F15A24?style=for-the-badge&logo=timescaledb&logoColor=white)](https://www.timescale.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## Resumo do Projeto

O objetivo deste projeto é demonstrar a eficiência do **TimescaleDB** para o armazenamento escalável de séries temporais (*Time-Series*), combinado com a flexibilidade de dados do modelo **NoSQL** através do uso da coluna nativa **JSONB** do PostgreSQL. A aplicação simula o fluxo de dados coletados por uma rede de estações meteorológicas domésticas, registrando métricas em tempo real (como temperatura, umidade, vento) e eventos dinâmicos (como chuva, nevoeiro e ventania) de forma escalável.

---

## Como Executar

Para rodar o projeto, certifique-se de ter o Docker Desktop instalado e ativo. No terminal, navegue até a pasta raiz do projeto e utilize o utilitário do Docker Compose para inicializar os serviços em segundo plano. O script de sementes inicial inserido no banco criará a tabela e os dados de exemplo automaticamente durante a primeira inicialização.
