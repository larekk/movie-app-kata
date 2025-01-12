import { useEffect, useState } from 'react'
import { Offline, Online } from 'react-detect-offline'
import { Tabs } from 'antd'
import './app.css'

import ErrorItem from '../error-item/Error-item'
import UnratedFilmsLogic from '../unrated-films-logic/Unrated-films-logic'
import UnratedFilms from '../unrated-films/Unrated-films'
import RatedFilms from '../rated-films/Rated-films'

export default function App() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
    },
  }

  const [error, setError] = useState(false)
  const [guestSessionID, setGuestSessionID] = useState(null)
  const [genres, setGenres] = useState(null)

  const unratedMovies = new UnratedFilmsLogic()

  function onError() {
    setError(true)
  }

  const onChangeTab = (key) => {
    if (key === '2') {
      return <RatedFilms genres={genres} guestSessionID={guestSessionID} setError={setError}></RatedFilms>
    }
  }

  async function createGuestSession(url, options) {
    fetch(url, options)
      .then((res) => res.json())
      .then(({ guest_session_id }) => {
        setGuestSessionID(guest_session_id)
      })
      .catch((err) => {
        console.log(err)
        onError()
      })
  }

  useEffect(() => {
    unratedMovies.getGenres(setGenres)
    createGuestSession('https://api.themoviedb.org/3/authentication/guest_session/new', options)
  }, [])

  if (error) return <ErrorItem />

  const tabs = [
    {
      key: '1',
      label: 'Search',
      children: (
        <UnratedFilms
          genres={genres}
          setGenres={setGenres}
          guestSessionID={guestSessionID}
          setError={setError}
        ></UnratedFilms>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: (
        <>
          <RatedFilms genres={genres} guestSessionID={guestSessionID} setError={setError}></RatedFilms>
        </>
      ),
    },
  ]

  return (
    <>
      <Offline> You are offline right now. Check your connection</Offline>
      <Online>
        <Tabs defaultActiveKey="1" centered items={tabs} onChange={onChangeTab} />
      </Online>
    </>
  )
}
