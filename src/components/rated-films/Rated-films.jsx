import { Layout, Typography } from 'antd'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'

import { ContextGenres } from '../genres-context/genres-context'
import MovieItem from '../movie-item/Movie-item'
import Spinner from '../spinner/Spinner'
import MoviesList from '../movie-list/Movie-list'
import PaginationList from '../pagination/Pagination-list'
import RatedFilmsLogic from '../rated-films-logic/Rated-films-logic'

export default function RatedFilms({ genres, setError, guestSessionID }) {
  const { Content, Footer } = Layout

  const [ratedTotalPages, setRatedTotalPages] = useState(1)
  const [ratedCurrent, setRatedCurrent] = useState(1)
  const [ratedMovieList, setRatedMovieList] = useState([])
  const [loading, setLoading] = useState(true)

  const ratedMovies = new RatedFilmsLogic()

  const onChangeRatedPage = (page) => {
    setRatedCurrent(page)
    setLoading(true)
  }
  async function rateMovie(options, filmId) {
    return fetch(
      `https://api.themoviedb.org/3/movie/${filmId}/rating?guest_session_id=${guestSessionID}`,
      options
    ).catch((err) => {
      console.log(err)
    })
  }

  function updateRated() {
    return ratedMovies.getRatedMovies(
      guestSessionID,
      ratedCurrent,
      setRatedMovieList,
      setRatedTotalPages,
      setLoading,
      setError
    )
  }

  useEffect(() => {
    updateRated()
  }, [ratedCurrent])

  let ratedListMovies

  if (ratedMovieList) {
    ratedListMovies = ratedMovieList.map((movie) => {
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
      <Typography.Title level={5} className={'noResults'}>
        There is no rated films
      </Typography.Title>
    )
  }

  return (
    <Layout className={'defaultStyle'}>
      <Content className={'defaultStyleMargin'}>
        {loading ? <Spinner /> : <MoviesList>{ratedListMovies}</MoviesList>}
      </Content>
      <Footer className={'defaultStyle'}>
        <PaginationList pages={ratedTotalPages} current={ratedCurrent} onChangePage={onChangeRatedPage} />
      </Footer>
    </Layout>
  )
}
