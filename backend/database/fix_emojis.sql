USE orderflow;

-- Restaurar emojis usando los bytes UTF-8 exactos de cada caracter
-- 🍔 U+1F354 → F0 9F 8D 94
UPDATE productos SET image = CONVERT(UNHEX('F09F8D94') USING utf8mb4) WHERE id = 1;
-- 🍟 U+1F35F → F0 9F 8D 9F
UPDATE productos SET image = CONVERT(UNHEX('F09F8D9F') USING utf8mb4) WHERE id = 2;
-- 🥤 U+1F964 → F0 9F A5 A4
UPDATE productos SET image = CONVERT(UNHEX('F09FA5A4') USING utf8mb4) WHERE id = 3;
-- 🍲 U+1F372 → F0 9F 8D B2
UPDATE productos SET image = CONVERT(UNHEX('F09F8DB2') USING utf8mb4) WHERE id = 4;
