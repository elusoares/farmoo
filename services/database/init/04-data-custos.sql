-- ============================================================
-- CUSTOS (3 meses: jun, jul, ago/2026)
-- ============================================================
SET search_path TO farmoo;
-- ---------- CUSTOS GERAIS ----------
INSERT INTO custos (tipo, descricao, valor, data, animal_id) VALUES
('racao',      'Ração para o galinheiro (saco 20kg)', 80.00,  '2026-06-05', NULL),
('racao',      'Ração para o galinheiro (saco 20kg)', 80.00,  '2026-07-05', NULL),
('racao',      'Ração para o galinheiro (saco 20kg)', 80.00,  '2026-08-05', NULL),
('racao',      'Ração para o chiqueiro (saco 40kg)',  150.00, '2026-06-10', NULL),
('racao',      'Ração para o chiqueiro (saco 40kg)',  150.00, '2026-07-10', NULL),
('racao',      'Ração para o chiqueiro (saco 40kg)',  150.00, '2026-08-10', NULL),
('vacina',     'Vacina do rebanho (aftosa)',          200.00, '2026-06-15', NULL),
('vacina',     'Vacina do rebanho (aftosa)',          200.00, '2026-08-15', NULL),
('ferramenta', 'Compra de tesoura de tosquia',        120.00, '2026-06-01', NULL),
('energia',    'Conta de luz do galpão',               90.00, '2026-06-30', NULL),
('energia',    'Conta de luz do galpão',               95.00, '2026-07-30', NULL),
('energia',    'Conta de luz do galpão',              100.00, '2026-08-30', NULL);

-- ---------- CUSTOS ESPECÍFICOS ----------
INSERT INTO custos (tipo, descricao, valor, data, animal_id) VALUES
-- Mimosa (id=1)
('remedio', 'Remédio para mastite (Mimosa)',  80.00, '2026-06-12', 1),
('remedio', 'Remédio para carrapato (Mimosa)',40.00, '2026-07-20', 1),
('racao',   'Ração especial (Mimosa)',        60.00, '2026-08-01', 1),
-- Malhada (id=3)
('remedio', 'Remédio para pneumonia (Malhada)',  150.00, '2026-06-20', 3),
('remedio', 'Remédio para verme (Malhada)',       80.00, '2026-07-15', 3),
('racao',   'Ração especial (Malhada)',          100.00, '2026-08-01', 3),
('vacina',  'Vacina extra (Malhada)',             90.00, '2026-08-10', 3),
-- Preta (id=6)
('remedio', 'Remédio para ferida (Preta)',  120.00, '2026-06-25', 6),
('remedio', 'Remédio para febre (Preta)',    90.00, '2026-07-25', 6),
-- Giselda (id=13)
('vacina', 'Vacina para galinhas (Giselda)', 15.00, '2026-06-01', 13),
-- Pintinhos (ids 18-22)
('racao', 'Ração para pintinhos', 30.00, '2026-07-25', 18),
('racao', 'Ração para pintinhos', 30.00, '2026-07-25', 19),
('racao', 'Ração para pintinhos', 30.00, '2026-07-25', 20),
('racao', 'Ração para pintinhos', 30.00, '2026-07-25', 21),
('racao', 'Ração para pintinhos', 30.00, '2026-07-25', 22),
-- Porcos (ids 38-39)
('racao', 'Ração de engorda (Bacon)',     100.00, '2026-06-01', 38),
('racao', 'Ração de engorda (Bacon)',     100.00, '2026-07-01', 38),
('racao', 'Ração de engorda (Bacon)',     100.00, '2026-08-01', 38),
('racao', 'Ração de engorda (Torresmo)',  100.00, '2026-06-01', 39),
('racao', 'Ração de engorda (Torresmo)',  100.00, '2026-07-01', 39),
('racao', 'Ração de engorda (Torresmo)',  100.00, '2026-08-01', 39),
('vacina','Vacina (Bacon)',                50.00, '2026-06-15', 38),
('vacina','Vacina (Torresmo)',             50.00, '2026-06-15', 39),
-- Ovelhas (ids 28-30)
('racao', 'Ração para ovelhas (Lãzinha)',   50.00, '2026-06-01', 28),
('racao', 'Ração para ovelhas (Branca)',    50.00, '2026-06-01', 29),
('racao', 'Ração para ovelhas (Preta)',     50.00, '2026-06-01', 30),
('racao', 'Ração para ovelhas (Lãzinha)',   50.00, '2026-07-01', 28),
('racao', 'Ração para ovelhas (Branca)',    50.00, '2026-07-01', 29),
('racao', 'Ração para ovelhas (Preta)',     50.00, '2026-07-01', 30);