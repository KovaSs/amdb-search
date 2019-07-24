import React from 'react'

const TestRequest = () => {
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
          inn: ["670700894121", "672303524953"]
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

  const request = () => {
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
          inn: ["670700894121", "672303524953"]
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
      <button onClick={white}> Запрос в белую БД </button>
      <button onClick={request}> Запрос в черную БД </button>
      <button onClick={whiteUl}> Запрос в белую БД ЮЛ</button>
    </>
  )
}

export default TestRequest
