-- ============================================================
-- VIEWS PARA O MCP (isolamento das tabelas)
-- ============================================================
SET search_path TO farmoo;
-- ---------- VIEWS DO SERVIÇO DE ANIMAIS ----------

CREATE VIEW vw_animais AS
SELECT
    id, tipo, nome, origem,
    valor_compra, data_compra,
    data_nascimento, mae_id, pai_id,
    vendido, valor_venda, data_venda,
    CASE WHEN vendido THEN 'vendido' ELSE 'ativo' END AS status
FROM animais;

-- ---------- VIEWS DO SERVIÇO DE PRODUÇÃO ----------

CREATE VIEW vw_producoes AS
SELECT
    p.id, p.animal_id,
    a.nome AS nome_animal, a.tipo AS tipo_animal,
    p.tipo, p.quantidade, p.unidade, p.data,
    p.vendido, p.valor_venda, p.data_venda,
    CASE WHEN p.vendido THEN 'vendido' ELSE 'em estoque' END AS status
FROM producoes p
JOIN animais a ON p.animal_id = a.id;

CREATE VIEW vw_estoque_producoes AS
SELECT
    p.tipo AS produto,
    p.unidade,
    SUM(p.quantidade) AS quantidade_produzida,
    COALESCE(SUM(p.quantidade) FILTER (WHERE p.vendido), 0) AS quantidade_vendida,
    COALESCE(SUM(p.quantidade) FILTER (WHERE NOT p.vendido), 0) AS quantidade_disponivel
FROM producoes p
GROUP BY p.tipo, p.unidade;

-- ---------- VIEWS DO SERVIÇO FINANCEIRO ----------

CREATE VIEW vw_custos AS
SELECT
    c.id, c.tipo, c.descricao, c.valor, c.data,
    c.animal_id,
    a.nome AS nome_animal,
    CASE WHEN c.animal_id IS NULL THEN 'geral' ELSE 'especifico' END AS escopo
FROM custos c
LEFT JOIN animais a ON c.animal_id = a.id;

CREATE VIEW vw_vendas AS
SELECT
    id,
    tipo AS produto,
    quantidade,
    valor_venda / quantidade AS preco_unitario,
    valor_venda AS valor_total,
    data_venda AS data
FROM producoes
WHERE vendido;

-- Resultado por animal (custos − receitas estimadas)
CREATE VIEW vw_resultado_por_animal AS
SELECT
    a.id AS animal_id,
    a.nome AS nome_animal,
    a.tipo AS tipo_animal,
    COALESCE(c.total_custos, 0) AS total_custos,
    COALESCE(v.valor_venda, 0) AS total_vendas,
    COALESCE(v.valor_venda, 0) - COALESCE(c.total_custos, 0) AS resultado,
    CASE
        WHEN COALESCE(v.valor_venda, 0) - COALESCE(c.total_custos, 0) > 0 THEN 'lucro'
        WHEN COALESCE(v.valor_venda, 0) - COALESCE(c.total_custos, 0) < 0 THEN 'prejuizo'
        ELSE 'neutro'
    END AS situacao
FROM animais a
LEFT JOIN (
    SELECT animal_id, SUM(valor) AS total_custos
    FROM custos
    WHERE animal_id IS NOT NULL
    GROUP BY animal_id
) c ON c.animal_id = a.id
LEFT JOIN (
    SELECT id, valor_venda
    FROM animais
    WHERE vendido = TRUE
) v ON v.id = a.id;