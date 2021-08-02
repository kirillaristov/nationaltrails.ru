# Назначение каталогов и файлов

* `archetypes/default.md` - заготовка нового поста
* `assets/` - сss+js файлы
* `content/` - __страницы с текстом в формате markdown__
* `data/` - содержит файл `month.yaml` с массивом месяцев для вызова `$.Site.Data.month`
* `layouts/` - __шаблоны__
  * `404/` - шаблон ошибки 404
  * `_default/` - базовые шаблоны
    * `_markup/` - содержит `render-heading.html` для `<h1>-<h6>`, `render-image.html` для `<img>`, `render-link.html` для `<a>`
    * `baseof.html` - __корневой шаблон, отсюда всё начинается__
    * `list.html` - шаблон индексного файла контента (имя которого начинается с подчеркивания `_index.md`)
    * `rss.xml` - шаблон rss-ленты
    * `single.html` - шаблон одиночного файла `index.md`
  * `blog/` - шаблоны страниц `blog/`
  * `media/` - шаблоны страниц `media/`
  * `my-routes/` - шаблоны страниц `my-routes/`
  * `partials/` - компоненты шаблонов, пример вызова `{{ partial "get-title" . }}`
  * `shortcodes/` - шаблоны коротких вставок в файлы контента `*.md`, пример вызова `{{< youtube-thumb "T2VpOYXu3vQ" >}}`
  * `taxonomy/` - шаблоны категорий и тегов
    * `term.html` - шаблон отдельной категории `(/ru/categories/as-the-first-settlers/)` и отдельного тега `(/ru/tags/2008/)`
    * `terms.html` - шаблон перечисления категорий `/ru/categories/` и перечисления тегов `/ru/tags/`
  * `index.html` - шаблон корневого индексного файла
  * `robots.txt` - файл `robots.txt` в его конечном виде
* `static/` - содержит статичные файлы и директории. При сборке корневая папка `/static` из пути удаляется
  * `dist/images/` - графика для оформления
  * `fonts/` - шрифты
  * `kml-files/` - треки
  * `map/` - __карта__
  * `static/` - неизменяемые большие файлы
    * `media/` - __фотоархив__
    * `my-routes/` - файлы из маршрутов
    * `videos/thumbs/` - превью видео
  * `favicon.ico`
  * `logo.jpg`
* `README.md` - этот файл
* `config.yaml` - конфиг `hugo`
* `index.html` - домашняя страница github pages [kirillaristov.github.io](https://kirillaristov.github.io)
* `netlify.toml` - конфиг `netlify`


# Среда локальной разработки

## Hugo для Windows

1. Скачать последнюю версию `hugo` для `windows` [github.com/gohugoio/hugo/releases/latest](https://github.com/gohugoio/hugo/releases/latest) (0.83.1 на 2021-06-02)
2. Переместить `hugo.exe` из распакованного архива в `C:\Windows\System32`
3. Проверить: `hugo version`

## Git для Windows

1. Скачать последнюю версию `git` для `windows` [git-scm.com/download/win](https://git-scm.com/download/win) (2.31.1 на 2021-06-02)
2. Установить с параметрами по умолчанию
3. Перезагрузиться
4. Проверить `git version`


# Тестирование

## Первый запуск локальной копии сайта

1. Создать локальный рабочий каталог `mkdir c:\www\kir.com`
2. Перейти в него `cd c:\www\kir.com`
3. Клонировать оригинальный дистрибутив `git clone https://github.com/kirillaristov/kirillaristov.github.io.git .`
4. Запустить hugo `hugo server`
5. Проверить доступность сайта на адресе [localhost:1313](http://localhost:1313)

## Внесение правок в локальную копию и тестирование

1. Проверить наличие правок в основном дистрибутиве на github:
  * Перейти в локальный рабочий каталог `cd c:\www\kir.com`
  * Скопировать правки `git pull`
2. Запустить hugo `hugo server`
3. Внести правки в локальные исходники
4. Hugo автоматически произведет сборку - успешно или с ошибками
5. Протестировать правки на адресе [localhost:1313](http://localhost:1313)


#  Публикация

## Отправка правок на github

1. Перейти в локальный рабочий каталог `cd c:\www\kir.com`
2. Индексировать внесенные правки `git add .`
3. Создать коммит `git commit`
4. В открывшемся окне добавить описание правки, сохранить и закрыть окно
5. Отправить правку на github `git push` (однократно при первом запуске авторизоваться на `github`)

## Публикация на netlify

1. Разместить правку в [github.com/kirillaristov/kirillaristov.github.io](https://github.com/kirillaristov/kirillaristov.github.io) (через `git push` или веб-версию), затем:
2. Копируется автоматически в [app.netlify.com/sites/aristov](https://app.netlify.com/sites/aristov)
3. Собирается автоматически с параметрами, перечисленными в `config.yaml` и `netlify.toml`, расположенными в корне репозитория
4. Публикуется автоматически на [aristov.netlify.app](https://aristov.netlify.app)

## Отключение автоматической сборки

1. `Netlify` -> `kir.com` -> [`Deploys`](https://app.netlify.com/sites/aristov/deploys) -> `Deploy settings` -> секция `Build settings` -> `Edit settings` -> `Stop builds`
2. На подключенную почту придет оповещение о том, что автоматическая сборка отключена

## Включение автоматической сборки

1. `Netlify` -> `kir.com` -> [`Deploys`](https://app.netlify.com/sites/aristov/deploys) -> `Activate builds`
2. На подключенную почту придет оповещение о том, что автоматическая сборка включена и будет запущена после обновления репозитория
3. Для немедленного запуска сборки `Netlify` -> `kir.com` -> `Deploys` -> `Trigger deploy` -> `Deploy site`

## Публикация сборок

1. Если последняя сборка не опубликована, войти в сборку -> `Publish deploy`
2. Включение автоматической публикации сборок `Netlify` -> `kir.com` -> `Deploys` -> `Start auto publishing`

# Редактирование

## Добавление или редактирование пункта меню

1. Открыть файл страницы, на которую должен ссылаться пункт меню
2. Добавить в ее frontmatter:
```
menu:
  main:
    name: Имя пункта меню
    weight: Очередность вывода, цифра
```

