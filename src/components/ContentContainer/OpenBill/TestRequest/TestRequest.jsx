import React from 'react'
import { Button } from 'antd'

const TestRequest = () => {
  const whiteStr = () => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: "Гарнелис",
          firstname: "Андрей",
          middlename: "Валерьевич",
          birthdate: ["1969-11-18"],
          series: "4505",
          number: "898143",
          inn: [""]
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  const blackStr = () => {
    return fetch(
      `/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_2.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: "Гарнелис",
          firstname: "Андрей",
          middlename: "Валерьевич",
          birthdate: ["1969-11-18"],
          series: "4505",
          number: "898143",
          inn: [""]
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }
  const whiteNull = () => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: "Гарнелис",
          firstname: "Андрей",
          middlename: "Валерьевич",
          birthdate: ["1969-11-18"],
          series: "4505",
          number: "898143",
          inn: [null]
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  const blackNull = () => {
    return fetch(
      `/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_2.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: "Гарнелис",
          firstname: "Андрей",
          middlename: "Валерьевич",
          birthdate: ["1969-11-18"],
          series: "4505",
          number: "898143",
          inn: [null]
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  const whiteUl = () => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'ul', 
          method: 'bases',
          ulinn: "3435116895"
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  const white = () => {
    return fetch(
      `/cgi-bin/serg/0/6/9/reports/253/STOP_LIST_custom_search.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: "Масютина",
          firstname: "Жанна",
          middlename: "Ивановна",
          birthdate: ["1976-12-10", "1971-12-10", "1976-10-01"],
          series: "6602",
          number: "604372",
          inn: ["670700894121"]
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  const black = () => {
    return fetch(
      `/cgi-bin/ser4/0/6/9/reports/253/STOP_LIST_deb_search_2.pl`, 
      { 
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body : JSON.stringify({ 
          type: 'fl',
          method: 'bases',
          surname: "Масютина",
          firstname: "Жанна",
          middlename: "Ивановна",
          birthdate: ["1976-12-10", "1971-12-10", "1976-10-01"],
          series: "6602",
          number: "604372",
          inn: ["670700894121"]
        }),
      }
    )
    .then(res => {
      if (res.ok) return res.json()
      throw new TypeError("Ошибка получения данных!")
    })
  }

  return (
    <>
      <div>
        <Button style={{margin: 5}} onClick={whiteStr}> Запрос в белую БД / [""]</Button>
        <Button style={{margin: 5}} onClick={blackStr}> Запрос в черную БД / [""] </Button>
        <Button style={{margin: 5}} onClick={whiteUl}> Запрос в белую БД ЮЛ </Button>
      </div>
      <div>
        <Button style={{margin: 5}} onClick={whiteNull}> Запрос в белую БД / [null]</Button>
        <Button style={{margin: 5}} onClick={blackNull}> Запрос в черную БД / [null]</Button>
      </div>
      <div>
        <Button style={{margin: 5}} onClick={white}> Запрос в белую БД </Button>
        <Button style={{margin: 5}} onClick={black}> Запрос в черную БД </Button>
      </div>
    </>
  )
}

export default TestRequest
