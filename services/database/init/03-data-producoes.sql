-- ============================================================
-- PRODUÇÕES (3 meses: jun, jul, ago/2026)
-- ============================================================
SET search_path TO farmoo;
-- ---------- LEITE ----------
INSERT INTO producoes (animal_id, tipo, quantidade, unidade, data) VALUES
-- Mimosa (id=1)
(1, 'leite', 3.0, 'litros', '2026-06-01'), (1, 'leite', 3.2, 'litros', '2026-06-05'),
(1, 'leite', 2.8, 'litros', '2026-06-10'), (1, 'leite', 3.1, 'litros', '2026-06-15'),
(1, 'leite', 3.0, 'litros', '2026-06-20'), (1, 'leite', 3.3, 'litros', '2026-07-01'),
(1, 'leite', 3.1, 'litros', '2026-07-05'), (1, 'leite', 2.9, 'litros', '2026-07-10'),
(1, 'leite', 3.2, 'litros', '2026-07-15'), (1, 'leite', 3.0, 'litros', '2026-08-01'),
(1, 'leite', 3.4, 'litros', '2026-08-05'), (1, 'leite', 3.1, 'litros', '2026-08-10'),
-- Estrela (id=2)
(2, 'leite', 2.5, 'litros', '2026-06-01'), (2, 'leite', 2.6, 'litros', '2026-06-10'),
(2, 'leite', 2.4, 'litros', '2026-06-20'), (2, 'leite', 2.7, 'litros', '2026-07-01'),
(2, 'leite', 2.5, 'litros', '2026-07-10'), (2, 'leite', 2.6, 'litros', '2026-07-20'),
(2, 'leite', 2.5, 'litros', '2026-08-01'), (2, 'leite', 2.8, 'litros', '2026-08-10'),
-- Malhada (id=3)
(3, 'leite', 1.0, 'litros', '2026-06-05'), (3, 'leite', 0.8, 'litros', '2026-06-15'),
(3, 'leite', 0.9, 'litros', '2026-07-05'), (3, 'leite', 1.0, 'litros', '2026-07-15'),
(3, 'leite', 0.7, 'litros', '2026-08-05'), (3, 'leite', 0.9, 'litros', '2026-08-15'),
-- Pintada (id=4)
(4, 'leite', 2.0, 'litros', '2026-06-10'), (4, 'leite', 2.2, 'litros', '2026-06-20'),
(4, 'leite', 2.1, 'litros', '2026-07-10'), (4, 'leite', 2.0, 'litros', '2026-07-20'),
(4, 'leite', 2.3, 'litros', '2026-08-10'), (4, 'leite', 2.1, 'litros', '2026-08-20'),
-- Branca (id=5)
(5, 'leite', 3.0, 'litros', '2026-06-01'), (5, 'leite', 3.1, 'litros', '2026-06-15'),
(5, 'leite', 3.2, 'litros', '2026-07-01'), (5, 'leite', 3.0, 'litros', '2026-07-15'),
(5, 'leite', 3.3, 'litros', '2026-08-01'), (5, 'leite', 3.1, 'litros', '2026-08-15'),
-- Preta (id=6)
(6, 'leite', 1.2, 'litros', '2026-06-05'), (6, 'leite', 1.1, 'litros', '2026-06-20'),
(6, 'leite', 1.0, 'litros', '2026-07-05'), (6, 'leite', 1.3, 'litros', '2026-07-20'),
(6, 'leite', 1.1, 'litros', '2026-08-05'), (6, 'leite', 1.2, 'litros', '2026-08-20');

-- ---------- OVOS ----------
INSERT INTO producoes (animal_id, tipo, quantidade, unidade, data) VALUES
-- Giselda (id=13)
(13, 'ovos', 1.0, 'unidades', '2026-06-01'), (13, 'ovos', 1.0, 'unidades', '2026-06-05'),
(13, 'ovos', 1.0, 'unidades', '2026-06-10'), (13, 'ovos', 1.0, 'unidades', '2026-06-15'),
(13, 'ovos', 1.0, 'unidades', '2026-06-20'), (13, 'ovos', 1.0, 'unidades', '2026-07-01'),
(13, 'ovos', 1.0, 'unidades', '2026-07-05'), (13, 'ovos', 1.0, 'unidades', '2026-07-10'),
(13, 'ovos', 1.0, 'unidades', '2026-08-01'), (13, 'ovos', 1.0, 'unidades', '2026-08-05'),
(13, 'ovos', 1.0, 'unidades', '2026-08-10'), (13, 'ovos', 1.0, 'unidades', '2026-08-15'),
-- Carijó (id=14)
(14, 'ovos', 1.0, 'unidades', '2026-06-01'), (14, 'ovos', 1.0, 'unidades', '2026-06-10'),
(14, 'ovos', 1.0, 'unidades', '2026-06-20'), (14, 'ovos', 1.0, 'unidades', '2026-07-01'),
(14, 'ovos', 1.0, 'unidades', '2026-07-10'), (14, 'ovos', 1.0, 'unidades', '2026-08-01'),
(14, 'ovos', 1.0, 'unidades', '2026-08-10'),
-- Pretinha (id=15)
(15, 'ovos', 1.0, 'unidades', '2026-06-10'), (15, 'ovos', 1.0, 'unidades', '2026-07-10'),
(15, 'ovos', 1.0, 'unidades', '2026-08-10'),
-- Branquinha (id=16)
(16, 'ovos', 1.0, 'unidades', '2026-06-02'), (16, 'ovos', 1.0, 'unidades', '2026-06-12'),
(16, 'ovos', 1.0, 'unidades', '2026-07-02'), (16, 'ovos', 1.0, 'unidades', '2026-07-12'),
(16, 'ovos', 1.0, 'unidades', '2026-08-02'), (16, 'ovos', 1.0, 'unidades', '2026-08-12'),
-- Dourada (id=17)
(17, 'ovos', 1.0, 'unidades', '2026-06-20'), (17, 'ovos', 1.0, 'unidades', '2026-07-20'),
(17, 'ovos', 1.0, 'unidades', '2026-08-20');

-- ---------- LÃ ----------
INSERT INTO producoes (animal_id, tipo, quantidade, unidade, data) VALUES
(28, 'lã', 3.5, 'kg', '2026-06-15'),
(29, 'lã', 3.0, 'kg', '2026-06-15'),
(30, 'lã', 2.5, 'kg', '2026-06-15'),
(31, 'lã', 3.2, 'kg', '2026-06-20'),
(32, 'lã', 2.8, 'kg', '2026-06-20'),
(28, 'lã', 3.0, 'kg', '2026-08-15'),
(29, 'lã', 2.8, 'kg', '2026-08-15'),
(30, 'lã', 2.2, 'kg', '2026-08-15'),
(31, 'lã', 3.0, 'kg', '2026-08-20'),
(32, 'lã', 2.5, 'kg', '2026-08-20');