DROP SCHEMA IF EXISTS farmoo CASCADE;
CREATE SCHEMA farmoo;
SET search_path TO farmoo;

-- ============================================================
-- SCHEMA DA FAZENDA DIGITAL (PostgreSQL)
-- ============================================================

-- Tabela de animais
CREATE TABLE animais (
    id              SERIAL PRIMARY KEY,
    tipo            VARCHAR(50)  NOT NULL,
    nome            VARCHAR(100) NOT NULL,
    origem          VARCHAR(20)  NOT NULL CHECK (origem IN ('comprado', 'nascido')),

    valor_compra    NUMERIC(10,2) CHECK (valor_compra IS NULL OR valor_compra >= 0),
    data_compra     DATE,

    data_nascimento DATE,
    mae_id          INTEGER,
    pai_id          INTEGER,

    vendido         BOOLEAN NOT NULL DEFAULT FALSE,
    valor_venda     NUMERIC(10,2) CHECK (valor_venda IS NULL OR valor_venda >= 0),
    data_venda      DATE,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_mae FOREIGN KEY (mae_id) REFERENCES animais(id),
    CONSTRAINT fk_pai FOREIGN KEY (pai_id) REFERENCES animais(id),

    CONSTRAINT chk_origem_dados CHECK (
        (origem = 'comprado' AND valor_compra IS NOT NULL AND data_compra IS NOT NULL)
        OR
        (origem = 'nascido' AND data_nascimento IS NOT NULL)
    )
);

-- Tabela de produções
CREATE TABLE producoes (
    id          SERIAL PRIMARY KEY,
    animal_id   INTEGER NOT NULL,
    tipo        VARCHAR(50) NOT NULL,
    quantidade  NUMERIC(10,2) NOT NULL CHECK (quantidade > 0),
    unidade     VARCHAR(20) NOT NULL,
    data        DATE NOT NULL,
    vendido     BOOLEAN NOT NULL DEFAULT FALSE,
    valor_venda NUMERIC(10,2) CHECK (valor_venda IS NULL OR valor_venda >= 0),
    data_venda  DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_animal FOREIGN KEY (animal_id) REFERENCES animais(id),
    CONSTRAINT chk_venda_producao CHECK (
        (vendido = FALSE AND valor_venda IS NULL AND data_venda IS NULL)
        OR
        (vendido = TRUE AND valor_venda IS NOT NULL AND data_venda IS NOT NULL AND data_venda >= data)
    )
);

-- Tabela de custos
CREATE TABLE custos (
    id          SERIAL PRIMARY KEY,
    tipo        VARCHAR(50) NOT NULL,
    descricao   TEXT,
    valor       NUMERIC(10,2) NOT NULL CHECK (valor >= 0),
    data        DATE NOT NULL,
    animal_id   INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_animal_custo FOREIGN KEY (animal_id) REFERENCES animais(id)
);

-- Índices para performance
CREATE INDEX idx_animais_tipo ON animais(tipo);
CREATE INDEX idx_animais_vendido ON animais(vendido);
CREATE INDEX idx_producoes_animal ON producoes(animal_id);
CREATE INDEX idx_producoes_data ON producoes(data);
CREATE INDEX idx_producoes_vendido ON producoes(vendido);
CREATE INDEX idx_custos_animal ON custos(animal_id);
CREATE INDEX idx_custos_data ON custos(data);