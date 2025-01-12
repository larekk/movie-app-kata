import { Layout, Typography } from 'antd'
import { debounce } from 'lodash'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

import Search from '../search/Search'
import Spinner from '../spinner/Spinner'
import MoviesList from '../movie-list/Movie-list'
import PaginationList from '../pagination/Pagination-list'
import UnratedFilmsLogic from '../unrated-films-logic/Unrated-films-logic'
import { ContextGenres } from '../genres-context/genres-context'
import MovieItem from '../movie-item/Movie-item'

export default function UnratedFilms({ genres, setGenres, setError, guestSessionID }) {
  const { Header, Content, Footer } = Layout

  const [unratedTotalPages, setUnratedTotalPages] = useState(1)
  const [unratedCurrent, setUnratedCurrent] = useState(1)
  const [unratedMovieList, setUnratedMovieList] = useState([])
  const [searchResult, setSearchResult] = useState('return')
  const [loading, setLoading] = useState(true)

  const unratedMovies = new UnratedFilmsLogic()

  function setSearchLoading() {
    return setLoading(true)
  }

  const onChangeUnratedPage = (page) => {
    setLoading(true)
    setUnratedCurrent(page)
  }

  const searchUnratedFilms = debounce((value) => {
    setUnratedCurrent(1)
    return setSearchResult(value)
  }, 400)

  async function rateMovie(options, filmId) {
    return fetch(`https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${guestSessionID}`, options)
      .then((res) => res.json())
      .then((res) => res)
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    unratedMovies.getUnratedMovies(
      searchResult,
      unratedCurrent,
      setUnratedMovieList,
      setUnratedTotalPages,
      setLoading,
      setError
    )
  }, [searchResult, unratedCurrent])

  useEffect(() => {
    unratedMovies.getGenres(setGenres)
  }, [])

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

  if (unratedMovieList.length === 0 && !loading) {
    unratedListMovies = (
      <Typography.Title level={5} className={'noResults'}>
        Can&#39;t find any films with {searchResult}
      </Typography.Title>
    )
  }

  return (
    <Layout className={'defaultStyle'}>
      <Header className={'defaultStyle'}>
        <Search searchUnratedFilms={searchUnratedFilms} setSearchLoading={setSearchLoading} />
      </Header>
      <Content className={'defaultStyleMargin'}>
        {loading ? <Spinner /> : <MoviesList>{unratedListMovies}</MoviesList>}
      </Content>
      <Footer className={'defaultStyle'}>
        <PaginationList pages={unratedTotalPages} current={unratedCurrent} onChangePage={onChangeUnratedPage} />
      </Footer>
    </Layout>
  )
}
