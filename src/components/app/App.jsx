import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Offline, Online } from 'react-detect-offline'
import { debounce } from 'lodash'
import { Typography } from 'antd'

import MoviesList from '../movie-list/Movie-list'
import MovieItem from '../movie-item/Movie-item'
import Spinner from '../spinner/Spinner'
import ErrorItem from '../error-item/Error-item'
import PaginationList from '../pagination/Pagination-list'
import Search from '../search/Search'

export default function App() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
    },
  }

  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [current, setCurrent] = useState(1)
  const [searchResult, setSearchResult] = useState('return')

  const url = `https://api.themoviedb.org/3/search/movie?query=${searchResult}&include_adult=false&language=en-US&page=${current}`

  const onChangePage = (page) => {
    setLoading(true)
    setCurrent(page)
  }

  function onError() {
    setError(true)
  }

  const searchUnratedFilms = debounce((value) => {
    return setSearchResult(value)
  }, 400)

  function setSearchLoading() {
    return setLoading(true)
  }

  async function getResources(url, options) {
    return fetch(url, options)
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then(({ results, total_pages }) => {
        setMovieList(results)
        setTotalPages(total_pages)
        setLoading(false)
        setError(false)
      })
      .catch((err) => {
        console.log(err)
        onError()
      })
  }

  useEffect(() => {
    getResources(url, options)
  }, [url])

  let movies = movieList.map((movie) => {
    const moviePoster = movie.poster_path
      ? movie.poster_path
      : 'https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg'

    const movieReleaseDate = movie.release_date
      ? format(new Date(movie.release_date.split('-').join(' ,')), 'MMMM d, y')
      : 'unknown date'

    return (
      <MovieItem
        movie={movie}
        image={`https://image.tmdb.org/t/p/w500/${moviePoster}`}
        date={movieReleaseDate}
        key={movie.id}
      />
    )
  })

  if (movieList.length === 0 && !loading) {
    movies = (
      <Typography.Title level={5} style={{ paddingTop: 10, margin: 0 }}>
        Can&#39;t find any films with {searchResult}
      </Typography.Title>
    )
  }

  if (error) return <ErrorItem />

  return (
    <>
      <Offline> You are offline right now. Check your connection.</Offline>
      <Online>
        <Search searchUnratedFilms={searchUnratedFilms} setSearchLoading={setSearchLoading} />
        {loading ? <Spinner /> : <MoviesList>{movies}</MoviesList>}
        <PaginationList pages={totalPages} current={current} onChangePage={onChangePage} />
      </Online>
    </>
  )
}
