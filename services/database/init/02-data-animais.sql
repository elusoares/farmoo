-- ============================================================
-- ANIMAIS (50) — Compras em maio/2026, nascimentos em jun-ago/2026
-- ============================================================
SET search_path TO farmoo;
-- ---------- VACAS (12) ----------
INSERT INTO animais (tipo, nome, origem, valor_compra, data_compra) VALUES
('vaca', 'Mimosa',    'comprado', 3000.00, '2026-05-10'),
('vaca', 'Estrela',   'comprado', 2800.00, '2026-05-10'),
('vaca', 'Malhada',   'comprado', 3200.00, '2026-05-15'),
('vaca', 'Pintada',   'comprado', 2700.00, '2026-05-15'),
('vaca', 'Branca',    'comprado', 3100.00, '2026-05-20'),
('vaca', 'Preta',     'comprado', 2900.00, '2026-05-20'),
('vaca', 'Ruiva',     'comprado', 2600.00, '2026-05-25'),
('vaca', 'Flor',      'comprado', 3050.00, '2026-05-25');

INSERT INTO animais (tipo, nome, origem, data_nascimento, mae_id) VALUES
('vaca', 'Mimosinha', 'nascido', '2026-06-15', 1),
('vaca', 'Estrelinha','nascido', '2026-06-20', 2),
('vaca', 'Malhadinha','nascido', '2026-07-05', 3),
('vaca', 'Pintadinha','nascido', '2026-07-10', 4);

-- ---------- GALINHAS (15) ----------
INSERT INTO animais (tipo, nome, origem, valor_compra, data_compra) VALUES
('galinha', 'Giselda',   'comprado', 50.00, '2026-05-05'),
('galinha', 'Carijó',    'comprado', 45.00, '2026-05-05'),
('galinha', 'Pretinha',  'comprado', 55.00, '2026-05-05'),
('galinha', 'Branquinha','comprado', 48.00, '2026-05-10'),
('galinha', 'Dourada',   'comprado', 52.00, '2026-05-10'),
('galinha', 'Pintadinha','comprado', 47.00, '2026-05-15'),
('galinha', 'Marrom',    'comprado', 50.00, '2026-05-15'),
('galinha', 'Cinza',     'comprado', 46.00, '2026-05-20'),
('galinha', 'Vermelha',  'comprado', 53.00, '2026-05-20'),
('galinha', 'Amarela',   'comprado', 49.00, '2026-05-25');

INSERT INTO animais (tipo, nome, origem, data_nascimento, mae_id) VALUES
('galinha', 'Huguinho', 'nascido',  '2026-07-20', 13),
('galinha', 'Zezinho',   'nascido', '2026-07-20', 13),
('galinha', 'Luizinho',  'nascido', '2026-07-20', 13),
('galinha', 'Joaquina',  'nascido', '2026-07-20', 13),
('galinha', 'Francisca', 'nascido', '2026-07-20', 13);

-- ---------- OVELHAS (10) ----------
INSERT INTO animais (tipo, nome, origem, valor_compra, data_compra) VALUES
('ovelha', 'Lãzinha',   'comprado', 800.00, '2026-05-08'),
('ovelha', 'Branca',    'comprado', 750.00, '2026-05-08'),
('ovelha', 'Preta',     'comprado', 850.00, '2026-05-12'),
('ovelha', 'Cinza',     'comprado', 780.00, '2026-05-12'),
('ovelha', 'Marrom',    'comprado', 820.00, '2026-05-18'),
('ovelha', 'Malhada',   'comprado', 760.00, '2026-05-18'),
('ovelha', 'Dourada',   'comprado', 830.00, '2026-05-22');

INSERT INTO animais (tipo, nome, origem, data_nascimento, mae_id) VALUES
('ovelha', 'Lãzinha Jr', 'nascido', '2026-07-25', 28),
('ovelha', 'Branquinha', 'nascido', '2026-08-01', 29),
('ovelha', 'Pretinha',   'nascido', '2026-08-05', 30);

-- ---------- PORCOS (8) ----------
INSERT INTO animais (tipo, nome, origem, valor_compra, data_compra) VALUES
('porco', 'Bacon',       'comprado', 200.00, '2026-05-02'),
('porco', 'Torresmo',    'comprado', 220.00, '2026-05-02'),
('porco', 'Lombo',       'comprado', 210.00, '2026-05-06'),
('porco', 'Costela',     'comprado', 230.00, '2026-05-06'),
('porco', 'Pernil',      'comprado', 215.00, '2026-05-12'),
('porco', 'Barriga',     'comprado', 225.00, '2026-05-12'),
('porco', 'Papada',      'comprado', 205.00, '2026-05-20'),
('porco', 'Bolsonaro',   'comprado', 195.00, '2026-05-20');

-- ---------- PATOS (5) ----------
INSERT INTO animais (tipo, nome, origem, valor_compra, data_compra) VALUES
('pato', 'Donald',      'comprado', 80.00, '2026-05-15'),
('pato', 'Patolino',    'comprado', 85.00, '2026-05-15'),
('pato', 'Margarida',   'comprado', 90.00, '2026-05-20'),
('pato', 'Sergio Moro', 'comprado', 75.00, '2026-05-20'),
('pato', 'Quack',       'comprado', 88.00, '2026-05-28');