import { useState } from 'react'
import { format } from 'date-fns'
import { Offline, Online } from 'react-detect-offline'

import MoviesList from '../movie-list/Movie-list'
import MovieItem from '../movie-item/Movie-item'
import Spinner from '../spinner/Spinner'
import ErrorItem from '../error-item/Error-item'

export default function App() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
    },
  }
  const url = 'https://api.themoviedb.org/3/search/movie?query=return&include_adult=false&language=en-US&page=1'

  const [movieList, setMovieList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  function onError() {
    setError(true)
  }

  async function getResources(url, options) {
    return fetch(url, options)
      .then((res) => {
        if (res.ok) return res.json()
      })
      .then(({ results }) => {
        setLoading(false)
        setError(false)
        return setMovieList(results)
      })
      .catch((err) => {
        console.log(err)
        onError()
      })
  }

  getResources(url, options)

  const movies = movieList.map((movie) => {
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

  if (loading) return <Spinner />
  if (error) return <ErrorItem />

  return (
    <>
      <Offline> You are offline right now. Check your connection.</Offline>
      <Online>
        <MoviesList>{movies}</MoviesList>
      </Online>
    </>
  )
}
