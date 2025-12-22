#!/bin/bash

# Скрипт для локальной сборки и публикации образа в Docker Hub
# Используйте этот скрипт, если сборка на сервере зависает из-за нехватки памяти

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Локальная сборка и публикация образа в Docker Hub${NC}"
echo "=================================================="
echo ""

# 1. Проверка наличия .env файла
if [ ! -f .env ]; then
    echo -e "${RED}❌ ОШИБКА: Файл .env не найден!${NC}"
    echo "Создайте файл .env с необходимыми переменными:"
    echo "  - DOCKERHUB_USERNAME=yourusername"
    echo "  - NEXT_PUBLIC_SUPABASE_URL=..."
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY=..."
    exit 1
fi

# 2. Загрузка переменных из .env
echo -e "${YELLOW}📋 Загрузка переменных из .env...${NC}"
set -a
while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
        \#*|"") continue ;;
    esac
    line=$(echo "$line" | sed "s/^[[:space:]]*//;s/[[:space:]]*$//" | sed "s/[[:space:]]*=[[:space:]]*/=/")
    [ -z "$line" ] && continue
    if echo "$line" | grep -q "="; then
        export "$line" 2>/dev/null || true
    fi
done < .env
set +a

# 3. Проверка обязательных переменных
echo -e "${YELLOW}🔍 Проверка обязательных переменных...${NC}"
if [ -z "$DOCKERHUB_USERNAME" ]; then
    echo -e "${RED}❌ ОШИБКА: DOCKERHUB_USERNAME не установлен в .env файле!${NC}"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "${YELLOW}⚠️  ПРЕДУПРЕЖДЕНИЕ: NEXT_PUBLIC_SUPABASE_URL или NEXT_PUBLIC_SUPABASE_ANON_KEY не установлены!${NC}"
    echo "Сборка может завершиться с ошибкой."
    read -p "Продолжить? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

IMAGE_NAME="${DOCKERHUB_USERNAME}/bartech"
IMAGE_TAG="latest"

echo -e "${GREEN}✅ Переменные загружены${NC}"
echo "  DOCKERHUB_USERNAME: $DOCKERHUB_USERNAME"
echo "  IMAGE_NAME: $IMAGE_NAME"
echo ""

# 4. Проверка авторизации в Docker Hub
echo -e "${YELLOW}🔐 Проверка авторизации в Docker Hub...${NC}"
if ! docker info | grep -q "Username"; then
    echo -e "${YELLOW}⚠️  Вы не авторизованы в Docker Hub${NC}"
    echo "Войдите в Docker Hub:"
    docker login
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Ошибка авторизации в Docker Hub!${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Авторизация в Docker Hub подтверждена${NC}"
fi
echo ""

# 5. Проверка доступной памяти
echo -e "${YELLOW}💾 Проверка доступной памяти...${NC}"
if command -v free &> /dev/null; then
    TOTAL_MEM=$(free -g | awk '/^Mem:/{print $2}')
    echo "Доступно памяти: ${TOTAL_MEM}GB"
    if [ "$TOTAL_MEM" -lt 8 ]; then
        echo -e "${YELLOW}⚠️  ВНИМАНИЕ: Доступно менее 8GB RAM. Сборка может быть медленной или зависнуть.${NC}"
        read -p "Продолжить? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Не удалось проверить память (возможно macOS)${NC}"
    echo "Убедитесь, что у вас достаточно памяти (рекомендуется 8GB+)"
fi
echo ""

# 6. Очистка старых образов (опционально)
read -p "Удалить старые локальные образы bartech перед сборкой? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🧹 Очистка старых образов...${NC}"
    docker images "$IMAGE_NAME" --format "{{.ID}}" | xargs -r docker rmi -f 2>/dev/null || true
    docker images | grep bartech | awk '{print $3}' | xargs -r docker rmi -f 2>/dev/null || true
    echo -e "${GREEN}✅ Очистка завершена${NC}"
    echo ""
fi

# 7. Сборка образа
echo -e "${BLUE}🔨 Начало сборки образа...${NC}"
echo "Это может занять 10-30 минут в зависимости от скорости интернета и мощности машины"
echo ""

# Включаем BuildKit для более эффективной сборки
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Сборка с передачей build arguments
echo -e "${YELLOW}Сборка образа: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
docker build \
    --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
    --build-arg NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}" \
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}" \
    --progress=plain \
    .

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ОШИБКА: Сборка образа не удалась!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Сборка образа завершена успешно!${NC}"
echo ""

# 8. Проверка размера образа
echo -e "${YELLOW}📦 Информация об образе:${NC}"
docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"
echo ""

# 9. Публикация образа в Docker Hub
echo -e "${BLUE}📤 Публикация образа в Docker Hub...${NC}"
echo "Это может занять несколько минут в зависимости от размера образа и скорости интернета"
echo ""

docker push "${IMAGE_NAME}:${IMAGE_TAG}"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ ОШИБКА: Не удалось опубликовать образ в Docker Hub!${NC}"
    echo "Проверьте:"
    echo "  1. Авторизацию в Docker Hub: docker login"
    echo "  2. Права доступа к репозиторию ${IMAGE_NAME}"
    echo "  3. Подключение к интернету"
    exit 1
fi

echo -e "${GREEN}✅ Образ успешно опубликован в Docker Hub!${NC}"
echo ""

# 10. Проверка публикации
echo -e "${YELLOW}🔍 Проверка публикации...${NC}"
echo "Образ доступен по адресу:"
echo "  https://hub.docker.com/r/${IMAGE_NAME}/tags"
echo ""
echo "Для проверки выполните:"
echo "  docker pull ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""

# 11. Инструкции для сервера
echo -e "${BLUE}📋 Следующие шаги на сервере:${NC}"
echo "=================================================="
echo ""
echo "1. Подключитесь к серверу:"
echo "   ssh user@your-server"
echo ""
echo "2. Перейдите в директорию проекта:"
echo "   cd /opt/bartech  # или путь к вашему проекту"
echo ""
echo "3. Убедитесь, что в .env файле установлен DOCKERHUB_USERNAME:"
echo "   DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}"
echo ""
echo "4. Обновите приложение:"
echo "   make force-update"
echo ""
echo "Или вручную:"
echo "   docker pull ${IMAGE_NAME}:${IMAGE_TAG}"
echo "   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --force-recreate"
echo ""
echo -e "${GREEN}✅ Готово!${NC}"
