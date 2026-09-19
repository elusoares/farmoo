-- ============================================================
-- VENDAS (3 meses: jun, jul, ago/2026)
-- ============================================================
SET search_path TO farmoo;
-- ---------- VENDA DE LEITE ----------
INSERT INTO vendas (produto, quantidade, preco_unitario, valor_total, data) VALUES
('leite', 20.0, 3.00, 60.00, '2026-06-30'),
('leite', 22.0, 3.00, 66.00, '2026-07-31'),
('leite', 25.0, 3.20, 80.00, '2026-08-31'),
('leite', 15.0, 3.00, 45.00, '2026-06-30'),
('leite', 18.0, 3.10, 55.80, '2026-07-31');

-- ---------- VENDA DE OVOS ----------
INSERT INTO vendas (produto, quantidade, preco_unitario, valor_total, data) VALUES
('ovos', 30.0, 1.00, 30.00, '2026-06-30'),
('ovos', 35.0, 1.00, 35.00, '2026-07-31'),
('ovos', 40.0, 1.20, 48.00, '2026-08-31'),
('ovos', 25.0, 1.00, 25.00, '2026-06-30');

-- ---------- VENDA DE LÃ ----------
INSERT INTO vendas (produto, quantidade, preco_unitario, valor_total, data) VALUES
('lã', 10.0, 20.00, 200.00, '2026-06-30'),
('lã',  8.0, 22.00, 176.00, '2026-08-31');

-- ---------- VENDA DE ANIMAIS (UPDATE) ----------
UPDATE animais SET vendido = TRUE, valor_venda = 800.00, data_venda = '2026-08-20', updated_at = CURRENT_TIMESTAMP WHERE id = 38;
UPDATE animais SET vendido = TRUE, valor_venda = 850.00, data_venda = '2026-08-20', updated_at = CURRENT_TIMESTAMP WHERE id = 39;
UPDATE animais SET vendido = TRUE, valor_venda = 120.00, data_venda = '2026-07-15', updated_at = CURRENT_TIMESTAMP WHERE id = 46;
UPDATE animais SET vendido = TRUE, valor_venda = 130.00, data_venda = '2026-07-15', updated_at = CURRENT_TIMESTAMP WHERE id = 47;
UPDATE animais SET vendido = TRUE, valor_venda = 60.00,  data_venda = '2026-08-10', updated_at = CURRENT_TIMESTAMP WHERE id = 18;
UPDATE animais SET vendido = TRUE, valor_venda = 2500.00, data_venda = '2026-08-28', updated_at = CURRENT_TIMESTAMP WHERE id = 3;