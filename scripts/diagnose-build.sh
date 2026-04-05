#!/bin/bash

# Скрипт для диагностики проблем со сборкой Next.js

echo "🔍 Диагностика проблем со сборкой Next.js"
echo "=========================================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Проверка доступной памяти
echo "1️⃣ Проверка доступной памяти:"
if command -v free &> /dev/null; then
    free -h
    TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$TOTAL_MEM" -lt 8 ]; then
        echo -e "${YELLOW}⚠️  ВНИМАНИЕ: Доступно менее 8GB RAM. Рекомендуется минимум 8GB для сборки.${NC}"
    else
        echo -e "${GREEN}✅ Достаточно памяти для сборки${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Команда 'free' недоступна (возможно macOS)${NC}"
    echo "Проверьте память вручную через Activity Monitor (macOS) или Task Manager (Windows)"
fi
echo ""

# 2. Проверка Docker
echo "2️⃣ Проверка Docker:"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен!${NC}"
    exit 1
fi

DOCKER_VERSION=$(docker --version)
echo -e "${GREEN}✅ Docker установлен: $DOCKER_VERSION${NC}"

# Проверка доступной памяти Docker
if [ "$(uname)" == "Darwin" ]; then
    echo -e "${YELLOW}ℹ️  На macOS проверьте лимиты памяти в Docker Desktop: Settings → Resources → Memory${NC}"
else
    DOCKER_MEM=$(docker info 2>/dev/null | grep -i "Total Memory" | awk '{print $3}')
    if [ -n "$DOCKER_MEM" ]; then
        echo "Доступная память Docker: $DOCKER_MEM"
    fi
fi
echo ""

# 3. Проверка использования памяти Docker
echo "3️⃣ Использование памяти Docker:"
docker system df
echo ""

# 4. Проверка запущенных контейнеров
echo "4️⃣ Запущенные контейнеры:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.MemUsage}}"
echo ""

# 5. Проверка размера проекта
echo "5️⃣ Размер проекта:"
if [ -d "src" ]; then
    SRC_SIZE=$(du -sh src 2>/dev/null | awk '{print $1}')
    echo "  src/: $SRC_SIZE"
fi
if [ -d "public" ]; then
    PUBLIC_SIZE=$(du -sh public 2>/dev/null | awk '{print $1}')
    echo "  public/: $PUBLIC_SIZE"
fi
if [ -d "node_modules" ]; then
    NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | awk '{print $1}')
    echo "  node_modules/: $NODE_MODULES_SIZE"
fi
echo ""

# 6. Проверка переменных окружения
echo "6️⃣ Проверка переменных окружения:"
if [ -f ".env" ]; then
    if grep -q "AUTH_SECRET" .env; then
        echo -e "${GREEN}✅ AUTH_SECRET найден в .env${NC}"
    else
        echo -e "${YELLOW}⚠️  Добавьте AUTH_SECRET (≥32 символов) для production / Docker${NC}"
    fi
else
    echo -e "${RED}❌ Файл .env не найден!${NC}"
fi
echo ""

# 7. Проверка конфигурации Next.js
echo "7️⃣ Проверка конфигурации Next.js:"
if [ -f "next.config.mjs" ]; then
    echo -e "${GREEN}✅ next.config.mjs найден${NC}"
    if grep -q "output.*standalone" next.config.mjs; then
        echo -e "${GREEN}✅ Standalone режим включен${NC}"
    else
        echo -e "${YELLOW}⚠️  Standalone режим не включен (рекомендуется для Docker)${NC}"
    fi
else
    echo -e "${RED}❌ next.config.mjs не найден!${NC}"
fi
echo ""

# 8. Проверка Dockerfile
echo "8️⃣ Проверка Dockerfile:"
if [ -f "Dockerfile" ]; then
    if grep -q "max_old_space_size" Dockerfile; then
        MEM_LIMIT=$(grep "max_old_space_size" Dockerfile | grep -oE "[0-9]+")
        echo -e "${GREEN}✅ Лимит памяти Node.js установлен: ${MEM_LIMIT}MB${NC}"
        if [ "$MEM_LIMIT" -lt 4096 ]; then
            echo -e "${YELLOW}⚠️  Рекомендуется увеличить лимит до 8192MB${NC}"
        fi
    else
        echo -e "${RED}❌ Лимит памяти Node.js не установлен!${NC}"
    fi
else
    echo -e "${RED}❌ Dockerfile не найден!${NC}"
fi
echo ""

# 9. Рекомендации
echo "📋 Рекомендации:"
echo "================"
echo ""
echo "Если сборка зависает:"
echo "  1. Увеличьте лимит памяти Docker до минимум 8GB (12GB+ рекомендуется)"
echo "  2. Очистите Docker кеш: docker system prune -a"
echo "  3. Используйте: make clean-rebuild"
echo "  4. Проверьте логи: docker-compose build --progress=plain nextjs"
echo "  5. См. BUILD_TROUBLESHOOTING.md для подробных инструкций"
echo ""

# 10. Быстрая проверка последних логов
echo "10️⃣ Последние логи сборки (если есть):"
if docker ps -a --format "{{.Names}}" | grep -q "bartech-nextjs"; then
    echo "Логи контейнера bartech-nextjs:"
    docker logs --tail 20 bartech-nextjs 2>&1 | tail -10
else
    echo "Контейнер bartech-nextjs не найден"
fi
echo ""

echo "✅ Диагностика завершена!"
echo ""
echo "Для подробной информации см. BUILD_TROUBLESHOOTING.md"
