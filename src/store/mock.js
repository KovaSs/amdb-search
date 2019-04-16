export const data = {
  web: {
    title : "Курс 'Web-Разработчик'",
    lessons : [
      {
        id: "web-les-1",
        num: 1,
        title: "Урок №1",
        description: "Работа с графикой для верстальщика",
        icon : "/img/icon/icon-task-5.png",
        alt: "task-5",
        content : {
          mainVideo : {
            title : "Урок № 1. Работа с графикой для разработчика",
            url: 'https://www.youtube.com/embed/FRxSfKwwVcQ',
            provider: 'youtube',
            moments : [
              {
                title: "Навык работы с дизайн-макетом для верстальщика",
                time : "11:15"
              },
              {
                title: "Создание, удаление документов",
                time : ""
              },
              {
                title: "Горячие клавиши для быстрой работы",
                time : "11:35"
              },
              {
                title: "Работа со слоями, папками, смарт-объектами",
                time : "12:31"
              },
              {
                title: "Графика для web (gif, png, jpeg, svg)",
                time : "16:37"
              },
              {
                title: "Несколько способов сохранения изображений",
                time : "20:57"
              },
              {
                title: "Определение шрифтов",
                time : "31:12"
              },
            ]
          },
          additionaLinks : [
            {
              title : "Сайты с бесплатной векторной графикой",
              links : [
                "https://www.flaticon.com/",
                "https://iconmonstr.com/",
                "https://icomoon.io/app/#/select",
              ]
            },
            {
              title : "Векторизирование изображений",
              links : [
                "https://www.vectorizer.io/",
                "https://convertio.co/ru/",
                "https://www.online-convert.com",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "Доп видео №1",
              url : "https://www.youtube.com/embed/112lQsGJKhQ"
            },
            {
              title : "Доп видео №2",
              url : "https://www.youtube.com/embed/9_CFhkGyBLE"
            },
          ],
          files : [
            {
              title: "Макет",
              url: "http://isaev.store/www/Web-dew12/rs/files/01-maket.zip",
              type: "zip"
            }
          ],
          homeTask: {
            required : [
              {
                task : "Вырезать из макета всю графику (картинки и иконки), которые встречаются в этом макете",
                li: [
                  "Сохранить вырезанные изображения в папку “img”. В этой папке создайте подпапки. В макете есть несколько блоков: Шапка, виды услуг, преимущества и т.д. Назовите подпапки в соответствии с этими блоками, например, картинки из блока преимущества положите в папку “advantages”",
                  "В названии картинок можно использовать цифры и латинские буквы",
                  "Нельзя писать названия на кириллице (русском)",
                  "Нельзя писать на транслите (например, babushka, shapka и т.д.)",
                  "Пример названия картинки: icon-1.png или background.jpg",
                  "Сохранить все иконки в векторном формате SVG. Как это сделать, вы можете посмотреть в дополнительных видео к этому уроку",
                  "Совет: если захотите сохранить иконки плохого качества в svg, то лучше просто искать похожие иконки в сервисах, которые указаны в доп. ссылках. Иконки в png маленького разрешения всегда будут плохо конвертироваться в svg"
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-2",
        num: 2,
        title: "Дополнительный урок",
        description: "Настройка рабочего пространства",
        icon : "/img/icon/icon-task-6.png",
        alt: "task-6",
        content : {
          mainVideo : {
            title : "Настройка рабочего пространства",
            url : "https://www.youtube.com/embed/Tcgc__zayOg",
            provider: 'youtube',
            moments : [
              {
                title: "1) Создание директории (папки) с проектом",
                time : "00:46"
              },
              {
                title: "Правила именования проектов",
                time : ""
              },
              {
                title: "Ошибки при названии проектов",
                time : ""
              },
              {
                title: "Рекомендации по названию, хранению и т.д.",
                time : ""
              },
              {
                title: "2) Создание своего первого шаблона для работы",
                time : "05:33"
              },
              {
                title: "3) Настраиваем автообновление страницы (node js, browser-sync)",
                time : "06:40"
              },
              {
                title: "4) Создание папки с исходными файлами проекта",
                time : "10:40"
              },
              {
                title: "Отделяем исходники от продакшена",
                time : ""
              },
              {
                title: "Готовим папку под продакшн",
                time : ""
              },
              {
                title: "5) Настройка Sublime text 3 для работы",
                time : "15:36"
              },
              {
                title: "6) Хостинг",
                time : "16:34"
              },
              {
                title: "Что такое домен, что такое хостинг",
                time : "16:49"
              },
              {
                title: "Пример покупки хостинга от link-host",
                time : "18:37"
              },
              {
                title: "Для чего нужен FTP",
                time : "21:24"
              },
              {
                title: "Настройка FTP на примере программы FileZilla",
                time : "23:50"
              },
              {
                title: "Выгрузка сайта на хостин",
                time : "25:17"
              },
            ]
          },
          additionaLinks : [
            {
              title : "Лучшие плагины для Sublime Text",
              links : [
                "https://habrahabr.ru/post/235901/",
              ]
            },
            {
              title : "Sublime Text для фронтэнд-разработчика",
              links : [
                "https://habrahabr.ru/post/244681/",
              ]
            },
            {
              title : "Живая перезагрузка",
              links : [
                "https://webref.ru/dev/automate-with-gulp/live-reloading",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "Доп видео №1",
              url : "https://www.youtube.com/embed/G6BZ9sTXzxQ"
            },
            {
              title : "Доп видео №2",
              url : "https://www.youtube.com/embed/YF7P8SZjCjE"
            },
            {
              title : "Доп видео №3",
              url : "https://www.youtube.com/embed/6O4VOR4W1Ao"
            },
          ],
          files : [
            {
              title: "Emmet",
              url: "http://isaev.store/www/Web-dew12/rs/files/emmet.pdf",
              type: "pdf"
            }
          ],
          homeTask: {
            required : [
              {
                task : "1) Вырезать из макета всю графику (картинки и иконки), которые встречаются в этом макете",
                li: [
                  "Сохранить вырезанные изображения в папку “img”. В этой папке создайте подпапки. В макете есть несколько блоков: Шапка, виды услуг, преимущества и т.д. Назовите подпапки в соответствии с этими блоками, например, картинки из блока преимущества положите в папку “advantages”",
                  "В названии картинок можно использовать цифры и латинские буквы",
                  "Нельзя писать названия на кириллице (русском)",
                  "Нельзя писать на транслите (например, babushka, shapka и т.д.)",
                  "Пример названия картинки: icon-1.png или background.jpg",
                  "Сохранить все иконки в векторном формате SVG. Как это сделать, вы можете посмотреть в дополнительных видео к этому уроку",
                  "Совет: если захотите сохранить иконки плохого качества в svg, то лучше просто искать похожие иконки в сервисах, которые указаны в доп. ссылках. Иконки в png маленького разрешения всегда будут плохо конвертироваться в svg"
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-3",
        num: 3,
        title: "Урок №2",
        description: "Знакомcтво с основами HTML",
        icon : "/img/icon/icon-task-7.png",
        alt: "task-7",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-4",
        num: 4,
        title: "Урок №3",
        description: "Знакомство с основами CSS",
        icon : "/img/icon/icon-task-8.png",
        alt: "task-8",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-5",
        num: 5,
        title: "Урок №4",
        description: "Блочная модель CSS",
        icon : "/img/icon/icon-task-9.png",
        alt: "task-9",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-6",
        num: 6,
        title: "Урок №5",
        description: "Верстка макета на HTML и CSS",
        icon : "/img/icon/icon-task-10.png",
        alt: "task-10",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-7",
        num: 7,
        title: "1 неделя. Прямая трансляция",
        description: "Ответы на вопросы, разбор сложных моментов",
        icon : "/img/icon/icon-task-3.png",
        alt: "task-3",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-8",
        num: 8,
        title: "Урок №6",
        description: "Библиотека Bootstrap 4",
        icon : "/img/icon/icon-task-12.png",
        alt: "task-12",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-9",
        num: 9,
        title: "Урок №7",
        description: "Верстка на Bootstrap",
        icon : "/img/icon/icon-task-13.png",
        alt: "task-13",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-10",
        num: 10,
        title: "Урок №8",
        description: "Препроцессор SASS/SCSS",
        icon : "/img/icon/icon-task-14.png",
        alt: "task-14",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-11",
        num: 11,
        title: "Урок №9",
        description: "Flexbox верстка",
        icon : "/img/icon/icon-task-15.png",
        alt: "task-15",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: 'youtube',
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-12",
        num: 12,
        title: "Бонус урок №1",
        description: "Адаптивная верстка",
        icon : "/img/icon/icon-task-16.png",
        alt: "task-16",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-13",
        num: 13,
        title: "2 неделя. Прямая трансляция",
        description: "Ответы на вопросы, разбор сложных моментов",
        icon : "/img/icon/icon-task-3.png",
        alt: "task-3",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-14",
        num: 14,
        title: "Урок №10",
        description: "Шрифты на сайте",
        icon : "/img/icon/icon-task-17.png",
        alt: "task-17",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-15",
        num: 15,
        title: "Урок №11",
        description: "Псевдоклассы и псевдоэлементы",
        icon : "/img/icon/icon-task-18.png",
        alt: "task-18",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-16",
        num: 16,
        title: "Урок №12",
        description: "Формы на сайте",
        icon : "/img/icon/icon-task-19.png",
        alt: "task-19",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-17",
        num: 17,
        title: "Урок №13",
        description: "Знакомство с JavaScript",
        icon : "/img/icon/icon-task-20.png",
        alt: "task-20",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-18",
        num: 18,
        title: "Урок №14",
        description: "Всплывающие окна на jQuery",
        icon : "/img/icon/icon-task-21.png",
        alt: "task-21",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-19",
        num: 19,
        title: "3 неделя. Прямая трансляция",
        description: "Ответы на вопросы, разбор сложных моментов",
        icon : "/img/icon/icon-task-3.png",
        alt: "task-3",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-20",
        num: 20,
        title: "Бонус - урок №2",
        description: "Ответы на вопросы, разбор сложных моментов",
        icon : "/img/icon/icon-task-33.png",
        alt: "task-33",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-21",
        num: 21,
        title: "Урок №15",
        description: "Анимация на CSS3",
        icon : "/img/icon/icon-task-22.png",
        alt: "task-22",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-22",
        num: 22,
        title: "Бонус - урок №3",
        description: "Слайдер на сайте",
        icon : "/img/icon/icon-task-23.png",
        alt: "task-23",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-23",
        num: 23,
        title: "Практика. Часть1",
        description: "Форма + блок “Производство”",
        icon : "/img/icon/icon-task-34.png",
        alt: "task-34",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-24",
        num: 24,
        title: "Практика. Часть2",
        description: "Делаем адаптив",
        icon : "/img/icon/icon-task-34.png",
        alt: "task-34",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-25",
        num: 25,
        title: "4 неделя. Прямая трансляция",
        description: "Ответы на вопросы, разбор сложных моментов",
        icon : "/img/icon/icon-task-3.png",
        alt: "task-3",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-26",
        num: 26,
        title: "Урок №16",
        description: "Гео-карты для сайта",
        icon : "/img/icon/icon-task-24.png",
        alt: "task-24",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-27",
        num: 27,
        title: "Урок №17",
        description: "Аналитика для сайта",
        icon : "/img/icon/icon-task-28.png",
        alt: "task-28",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-28",
        num: 28,
        title: "Урок №18",
        description: "Как делаются многостраничные сайты",
        icon : "/img/icon/icon-task-26.png",
        alt: "task-26",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-29",
        num: 29,
        title: "Урок №19",
        description: "Тестирование верстки",
        icon : "/img/icon/icon-task-25.png",
        alt: "task-25",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-30",
        num: 30,
        title: "Урок №20",
        description: "Большой урок по WordPress",
        icon : "/img/icon/icon-task-27.png",
        alt: "task-27",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-31",
        num: 31,
        title: "5 неделя. Прямая трансляция",
        description: "Ответы на вопросы, разбор сложных моментов",
        icon : "/img/icon/icon-task-3.png",
        alt: "task-3",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-32",
        num: 32,
        title: "Урок №21",
        description: "Поиск клиентов и продажа своих услуг",
        icon : "/img/icon/icon-task-35.png",
        alt: "task-35",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-33",
        num: 33,
        title: "Бонус-урок по SEO",
        description: "3 часа подробного разбора поисковой оптимизации",
        icon : "/img/icon/icon-task-36.png",
        alt: "task-36",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-34",
        num: 34,
        title: "Финальная встреча на курсе. Прямая трансляция",
        description: "Вот и все :)",
        icon : "/img/icon/icon-task-3.png",
        alt: "task-3",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
      {
        id: "web-les-35",
        num: 35,
        title: "7 бонусная неделя. ФРИЛАНС",
        description: "6 часов подробного разбора всех тонкостей фриланса",
        icon : "/img/icon/icon-task-35.png",
        alt: "task-35",
        content : {
          mainVideo : {
            title : "",
            url : "",
            provider: "youtube",
            moments : [
              {
                title: "",
                time : ""
              },
            ]
          },
          additionaLinks : [
            {
              title : "",
              links : [
                "",
              ]
            },
          ],
          additionaVideo : [
            {
              title : "",
              url : ""
            },
          ],
          files : [
            {
              title: "",
              url: "",
              type: ""
            }
          ],
          homeTask: {
            required : [
              {
                task : "",
                li: [
                  "",
                ]
              }
            ]
          }
        }
      },
    ]
  },
  js : {

  }
}