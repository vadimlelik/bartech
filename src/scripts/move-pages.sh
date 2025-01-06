#!/bin/bash

# Создаем директорию (shop) если она еще не существует
mkdir -p src/app/\(shop\)

# Перемещаем все директории, кроме (pages), api и (landing)
for dir in src/app/*/; do
  dirname=$(basename "$dir")
  if [[ "$dirname" != "(pages)" && "$dirname" != "api" && "$dirname" != "(landing)" && "$dirname" != "(shop)" ]]; then
    mv "$dir" "src/app/(shop)/"
  fi
done

# Перемещаем основные файлы страниц, если они существуют
mv src/app/page.js src/app/(shop)/page.js 2>/dev/null || true
mv src/app/page.module.css src/app/(shop)/page.module.css 2>/dev/null || true
