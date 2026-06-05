-- =====================================================================
-- Seed opcional — popula a tabela `produtos` com o catálogo inicial.
-- Cole no SQL Editor depois do 0001_init.sql se quiser começar com dados.
-- =====================================================================

insert into public.produtos (nome, modelo, sabor, categoria, descricao, preco, preco_original, estoque, puffs, imagem_url) values
  ('Ignite V50 5000 Puffs', 'Ignite V50', null, 'Pods Descartáveis', 'Pod descartável com 5000 puffs, bateria recarregável', 89.90, 119.90, 10, '5000', '/products/ignite-v50.jpg'),
  ('Elfbar BC5000',         'Elfbar BC5000', null, 'Pods Descartáveis', 'Pod descartável premium com 5000 puffs', 99.90, 129.90, 10, '5000', '/products/elfbar-bc5000.jpg'),
  ('Lost Mary BM5000',      'Lost Mary BM5000', null, 'Pods Descartáveis', 'Design compacto, 5000 puffs, sabores intensos', 94.90, 124.90, 10, '5000', '/products/lost-mary.jpg'),
  ('Elf World DC5000',      'Elf World DC5000', null, 'Pods Descartáveis', 'Pod descartável com display de bateria e líquido', 79.90, 99.90, 10, '5000', '/products/elf-world.jpg'),
  ('Vozol Star 6000 Puffs', 'Vozol Star', null, 'Pods Descartáveis', 'Pod premium com 6000 puffs e design moderno', 109.90, 139.90, 10, '6000', '/products/vozol-star.jpg'),
  ('OXBAR G8000',           'OXBAR G8000', null, 'Pods Descartáveis', 'Pod de alta capacidade com 8000 puffs', 129.90, 159.90, 10, '8000', '/products/oxbar-g8000.jpg'),

  ('V300 - Watermelon Ice',  'V300', 'Watermelon Ice',  'Pods Descartáveis', 'Pod descartável V300, sabor Watermelon Ice',  79.90, 99.90, 10, null, '/products/v300.svg'),
  ('V300 - Strawberry Kiwi', 'V300', 'Strawberry Kiwi', 'Pods Descartáveis', 'Pod descartável V300, sabor Strawberry Kiwi', 79.90, 99.90, 10, null, '/products/v300.svg'),
  ('V300 - Mint',            'V300', 'Mint',            'Pods Descartáveis', 'Pod descartável V300, sabor Mint',            79.90, 99.90, 10, null, '/products/v300.svg'),
  ('V300 - Strawberry Ice',  'V300', 'Strawberry Ice',  'Pods Descartáveis', 'Pod descartável V300, sabor Strawberry Ice',  79.90, 99.90, 10, null, '/products/v300.svg'),
  ('V300 - Pineapple Ice',   'V300', 'Pineapple Ice',   'Pods Descartáveis', 'Pod descartável V300, sabor Pineapple Ice',   79.90, 99.90, 10, null, '/products/v300.svg'),
  ('V300 - Green Apple',     'V300', 'Green Apple',     'Pods Descartáveis', 'Pod descartável V300, sabor Green Apple',     79.90, 99.90, 10, null, '/products/v300.svg'),
  ('V300 - Grape Ice',       'V300', 'Grape Ice',       'Pods Descartáveis', 'Pod descartável V300, sabor Grape Ice',       79.90, 99.90, 10, null, '/products/v300.svg'),

  ('V155 - Strawberry Ice',  'V155', 'Strawberry Ice',  'Pods Descartáveis', 'Pod descartável V155, sabor Strawberry Ice',  59.90, 79.90, 10, null, '/products/v155.svg'),
  ('V155 - Watermelon Ice',  'V155', 'Watermelon Ice',  'Pods Descartáveis', 'Pod descartável V155, sabor Watermelon Ice',  59.90, 79.90, 10, null, '/products/v155.svg'),
  ('V155 - Grape',           'V155', 'Grape',           'Pods Descartáveis', 'Pod descartável V155, sabor Grape',           59.90, 79.90, 10, null, '/products/v155.svg'),
  ('V155 - Strawberry Kiwi', 'V155', 'Strawberry Kiwi', 'Pods Descartáveis', 'Pod descartável V155, sabor Strawberry Kiwi', 59.90, 79.90, 10, null, '/products/v155.svg'),

  ('Elf Bar Ice King - Strawberry Watermelon', 'Elf Bar Ice King', 'Strawberry Watermelon', 'Pods Descartáveis', 'Elf Bar Ice King, sabor Strawberry Watermelon', 119.90, 149.90, 10, null, '/products/elf-bar-ice-king.svg'),
  ('Elf Bar Ice King - Peach',                 'Elf Bar Ice King', 'Peach',                 'Pods Descartáveis', 'Elf Bar Ice King, sabor Peach',                 119.90, 149.90, 10, null, '/products/elf-bar-ice-king.svg'),
  ('Elf Bar Ice King - Tiger''s Blood',        'Elf Bar Ice King', 'Tiger''s Blood',        'Pods Descartáveis', 'Elf Bar Ice King, sabor Tiger''s Blood',        119.90, 149.90, 10, null, '/products/elf-bar-ice-king.svg'),

  ('Elf Bar 30K - Cherry Strazz',                       'Elf Bar 30K', 'Cherry Strazz',                       'Pods Descartáveis', 'Elf Bar 30K, sabor Cherry Strazz',                       169.90, 199.90, 10, '30000', '/products/elf-bar-30k.svg'),
  ('Elf Bar 30K - Black Gold Coconut Strawberry Ice',   'Elf Bar 30K', 'Black Gold Coconut Strawberry Ice',   'Pods Descartáveis', 'Elf Bar 30K, sabor Black Gold Coconut Strawberry Ice',   169.90, 199.90, 10, '30000', '/products/elf-bar-30k.svg'),

  ('SMOK Nord 4',        'SMOK Nord 4',        null, 'Pods Recarregáveis', 'Pod system recarregável com ajuste de potência', 189.90, 229.90, 10, null, '/products/smok-nord4.jpg'),
  ('Vaporesso XROS 3',   'Vaporesso XROS 3',   null, 'Pods Recarregáveis', 'Pod compacto com cartucho recarregável',         169.90, 199.90, 10, null, '/products/vaporesso-xros3.jpg'),
  ('Uwell Caliburn G2',  'Uwell Caliburn G2',  null, 'Pods Recarregáveis', 'Pod system leve e potente',                      159.90, 189.90, 10, null, '/products/caliburn-g2.jpg'),
  ('GeekVape Wenax K1',  'GeekVape Wenax K1',  null, 'Pods Recarregáveis', 'Design elegante, excelente produção de vapor',   149.90, 179.90, 10, null, '/products/wenax-k1.jpg'),

  ('Juice Salt 30ml - Mango Ice',  'Juice Salt 30ml', 'Manga Ice', 'Essências', 'Essência nic salt sabor manga gelada', 49.90, 59.90, 10, null, '/products/juice-mango.jpg'),
  ('Juice Salt 30ml - Grape Ice',  'Juice Salt 30ml', 'Uva Ice',   'Essências', 'Essência nic salt sabor uva gelada',   49.90, 59.90, 10, null, '/products/juice-grape.jpg'),
  ('Juice Salt 30ml - Watermelon', 'Juice Salt 30ml', 'Melancia',  'Essências', 'Essência nic salt sabor melancia',     49.90, 59.90, 10, null, '/products/juice-watermelon.jpg'),
  ('Juice Salt 30ml - Strawberry', 'Juice Salt 30ml', 'Morango',   'Essências', 'Essência nic salt sabor morango',      49.90, 59.90, 10, null, '/products/juice-strawberry.jpg'),

  ('Cartucho XROS 3 (2 unidades)', 'Cartucho XROS 3', null, 'Acessórios', 'Cartuchos de reposição para Vaporesso XROS 3', 39.90, null, 10, null, '/products/cartucho-xros.jpg'),
  ('Coil SMOK Nord (5 unidades)',  'Coil SMOK Nord',  null, 'Acessórios', 'Resistências de reposição para SMOK Nord',     49.90, null, 10, null, '/products/coil-smok.jpg');
