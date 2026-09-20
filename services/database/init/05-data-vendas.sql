-- ============================================================
-- VENDAS DE PRODUÇÕES E ANIMAIS
-- ============================================================
SET search_path TO farmoo;

-- Cada registro de produção é vendido como um lote completo.
UPDATE producoes
SET vendido = TRUE,
	valor_venda = quantidade * CASE tipo
		WHEN 'leite' THEN 3.00
		WHEN 'ovos' THEN 1.00
		WHEN 'lã' THEN 20.00
	END,
	data_venda = CASE
		WHEN data < '2026-07-01' THEN DATE '2026-06-30'
		ELSE DATE '2026-07-31'
	END
WHERE data < '2026-08-01';

-- ---------- VENDA DE ANIMAIS (UPDATE) ----------
UPDATE animais SET vendido = TRUE, valor_venda = 800.00, data_venda = '2026-08-20', updated_at = CURRENT_TIMESTAMP WHERE id = 38;
UPDATE animais SET vendido = TRUE, valor_venda = 850.00, data_venda = '2026-08-20', updated_at = CURRENT_TIMESTAMP WHERE id = 39;
UPDATE animais SET vendido = TRUE, valor_venda = 120.00, data_venda = '2026-07-15', updated_at = CURRENT_TIMESTAMP WHERE id = 46;
UPDATE animais SET vendido = TRUE, valor_venda = 130.00, data_venda = '2026-07-15', updated_at = CURRENT_TIMESTAMP WHERE id = 47;
UPDATE animais SET vendido = TRUE, valor_venda = 60.00,  data_venda = '2026-08-10', updated_at = CURRENT_TIMESTAMP WHERE id = 18;
UPDATE animais SET vendido = TRUE, valor_venda = 2500.00, data_venda = '2026-08-28', updated_at = CURRENT_TIMESTAMP WHERE id = 3;