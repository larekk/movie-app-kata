import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'
import { Typography, Tabs, Layout } from 'antd'

import MoviesList from '../movie-list/Movie-list'
import MovieItem from '../movie-item/Movie-item'
import Spinner from '../spinner/Spinner'
import ErrorItem from '../error-item/Error-item'
import PaginationList from '../pagination/Pagination-list'
import Search from '../search/Search'
import { ContextGenres } from '../genres-context/genres-context'

export default function App() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
    },
  }
  const optionsTest = {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }

  const api_key = '9c69142fb7448fd25c0daf725432ac2c'

  const { Header, Content, Footer } = Layout
  const [unratedMovieList, setUnratedMovieList] = useState([])
  const [ratedMovieList, setRatedMovieList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [unratedTotalPages, setUnratedTotalPages] = useState(1)
  const [unratedCurrent, setUnratedCurrent] = useState(1)
  const [ratedTotalPages, setRatedTotalPages] = useState(1)
  const [ratedCurrent, setRatedCurrent] = useState(1)
  const [searchResult, setSearchResult] = useState('return')
  const [guestSessionID, setGuestSessionID] = useState(null)
  const [genres, setGenres] = useState(null)

  const url = `https://api.themoviedb.org/3/search/movie?query=${searchResult}&include_adult=false&language=en-US&page=${unratedCurrent}`
  const ratedUrl = `https://api.themoviedb.org/3/guest_session/${guestSessionID}/rated/movies?api_key=${api_key}&language=en-US&page=${ratedCurrent}&sort_by=created_at.asc`

  const onChangeUnratedPage = (page) => {
    setLoading(true)
    setUnratedCurrent(page)
  }

  const onChangeRatedPage = (page) => {
    setRatedCurrent(page)
  }

  const onChangeTab = (key) => {
    if (key === '2') {
      return getRatedMovies(ratedUrl)
    }
  }

  function onError() {
    setError(true)
  }

  function setSearchLoading() {
    return setLoading(true)
  }

  const searchUnratedFilms = debounce((value) => {
    return setSearchResult(value)
  }, 400)

  async function getUnratedMovies(url, options) {
    return fetch(url, options)
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then(({ results, total_pages }) => {
        setUnratedMovieList(results)
        setUnratedTotalPages(total_pages)
        setLoading(false)
        setError(false)
      })
      .catch((err) => {
        console.log(err)
        onError()
      })
  }

  async function getRatedMovies(url) {
    return fetch(url, optionsTest)
      .then((res) => res.json())
      .then(({ results, total_pages }) => {
        setRatedMovieList(results)
        setRatedTotalPages(total_pages)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        onError()
      })
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

  async function rateMovie(options, filmId) {
    return fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${guestSessionID}`, options)
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => {
        console.log(err)
        onError()
      })
  }

  async function getGenres() {
    return fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)
      .then((res) => res.json())
      .then(({ genres }) => {
        setGenres(genres)
      })
      .catch((err) => console.error(err))
  }
  useEffect(() => {
    getGenres()
  }, [])

  useEffect(() => {
    createGuestSession('https://api.themoviedb.org/3/authentication/guest_session/new', options)
  }, [])

  useEffect(() => {
    getUnratedMovies(url, options)
  }, [url])

  let unratedListMovies = unratedMovieList.map((movie) => {
    const moviePoster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
      : 'https://dummyimage.com/400x600/d1d1d1/fff&text=no+poster'

    const movieReleaseDate = movie.release_date
      ? format(new Date(movie.release_date.split('-').join(' ,')), 'MMMM d, y')
      : 'unknown date'

    const rate = Math.round(movie.vote_average * 10)

    let color
    if (rate <= 30) {
      color = '#E90000'
    } else if (rate >= 30 && rate <= 50) {
      color = '#E97E00'
    } else if (rate >= 50 && rate <= 70) {
      color = '#E9D100'
    } else {
      color = '#66E900'
    }

    return (
      <ContextGenres.Provider value={genres} key={movie.id}>
        <MovieItem
          movie={movie}
          image={moviePoster}
          date={movieReleaseDate}
          rate={rate / 10}
          colorRate={color}
          movieId={movie.id}
          rateFilm={rateMovie}
          movieGenres={movie.genre_ids}
        />
      </ContextGenres.Provider>
    )
  })
  let ratedListMovies

  if (unratedMovieList.length === 0 && !loading) {
    unratedListMovies = (
      <Typography.Title level={5} style={{ paddingTop: 10, margin: 0 }}>
        Can&#39;t find any films with {searchResult}
      </Typography.Title>
    )
  }

  if (ratedMovieList) {
    ratedListMovies = ratedMovieList.map((movie) => {
      const moviePoster = movie.poster_path
        ? movie.poster_path
        : 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg'

      const movieReleaseDate = movie.release_date
        ? format(new Date(movie.release_date.split('-').join(' ,')), 'MMMM d, y')
        : 'unknown date'

      const rate = Math.round(movie.vote_average * 10)

      let color
      if (rate <= 30) {
        color = '#E90000'
      } else if (rate >= 30 && rate <= 50) {
        color = '#E97E00'
      } else if (rate >= 50 && rate <= 70) {
        color = '#E9D100'
      } else {
        color = '#66E900'
      }

      return (
        <ContextGenres.Provider value={genres} key={movie.id}>
          <MovieItem
            movie={movie}
            image={`https://image.tmdb.org/t/p/w500/${moviePoster}`}
            date={movieReleaseDate}
            rate={rate / 10}
            myRate={movie.rating}
            colorRate={color}
            movieId={movie.id}
            rateFilm={rateMovie}
            movieGenres={movie.genre_ids}
          />
        </ContextGenres.Provider>
      )
    })
  } else {
    ratedListMovies = (
      <Typography.Title level={5} style={{ paddingTop: 10, margin: 0 }}>
        There is no rated films
      </Typography.Title>
    )
  }

  if (error) return <ErrorItem />

  const tabs = [
    {
      key: '1',
      label: 'Search',
      children: (
        <Layout style={{ background: 'none', margin: 0, padding: 0 }}>
          <Header style={{ background: 'none', margin: 0, padding: 0 }}>
            <Search searchUnratedFilms={searchUnratedFilms} setSearchLoading={setSearchLoading} />
          </Header>
          <Content style={{ background: 'none', margin: '-30px 0 0 0', padding: 0 }}>
            {loading ? <Spinner /> : <MoviesList>{unratedListMovies}</MoviesList>}
          </Content>
          <Footer style={{ background: 'none', margin: 0, padding: 0 }}>
            <PaginationList pages={unratedTotalPages} current={unratedCurrent} onChangePage={onChangeUnratedPage} />
          </Footer>
        </Layout>
      ),
    },
    {
      key: '2',
      label: 'Rated',
      children: (
        <>
          <Layout style={{ background: 'none', margin: 0, padding: 0 }}>
            <Content style={{ background: 'none', margin: '-30px 0 0 0', padding: 0 }}>
              {loading ? <Spinner /> : <MoviesList>{ratedListMovies}</MoviesList>}
            </Content>
            <Footer style={{ background: 'none', margin: 0, padding: 0 }}>
              <PaginationList pages={ratedTotalPages} current={ratedCurrent} onChangePage={onChangeRatedPage} />
            </Footer>
          </Layout>
        </>
      ),
    },
  ]

  return (
    <>
      <Offline> You are offline right now. Check your connection</Offline>
      <Online>
        <Tabs defaultActiveKey="1" onChange={onChangeTab} centered items={tabs} />
      </Online>
    </>
  )
}
