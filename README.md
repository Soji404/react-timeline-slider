# React timeline slider

Интерактивная временная шкала с анимациями и слайдером исторических событий. Проект реализован на React с использованием GSAP для анимаций и Swiper.js для слайдера.

![Preview](https://i.postimg.cc/DZfMWzBx/2025-05-12-113321.png)

Ссылка [тут](http://localhost:3000){:target="_blank"}

## Технологии

- **React** (v19) - ядро приложения
- **TypeScript** - типизация компонентов
- **GSAP** - анимации чисел и вращающегося круга
- **Swiper.js** - слайдер событий
- **SCSS** - стилизация
- **Webpack** - сборка проекта

## Команды

- `npm run dev` — запускает проект в режиме разработки.
- `npm run build` — собирает проект для продакшена.
- `npm run start` — запускает сервер для папки `public` (нужно для просмотра собранного проекта).
- `npm run build-and-serve` — сначала собирает проект, затем запускает сервер.

## Установка и запуск

### Для разработки

1. Клонируйте репозиторий:
    ```bash
   git clone https://github.com/Soji404/react-timeline-slider
   ```

2. Установите зависимости:
    ```bash
    npm install
    ```

3. Запустите dev-сервер:
    ```bash
    npm run dev
    ```

Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

### Для production

1. Соберите проект:
    ```bash
    npm run build
    ```

2. Запустите сервер для production-сборки:
    ```bash
    npm run start
    ```

3.  Или используйте одну команду для сборки и запуска:
    ```bash
    npm run build-and-serve
    ```

> ⚠️ Перед использованием команды `build-and-serve` убедитесь, что установлен пакет `serve` глобально:
>
> ```bash
> npm install -g serve
> ```