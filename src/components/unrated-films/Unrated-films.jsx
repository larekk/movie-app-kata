export default class Unratedfilms {
  async getUnratedMovies(search, currentPage, setUnratedMovieList, setTotalPages, setLoading, setError) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
      },
    }
    const url = `https://api.themoviedb.org/3/search/movie?query=${search}&include_adult=false&language=en-US&page=${currentPage}`
    const res = await fetch(url, options)
    if (!res.ok) {
      setError(true)
      throw new Error(`Failed to fetch unrated movies, response: ${res.status}`)
    }
    const data = await res.json()
    const { results, total_pages } = await data
    await setUnratedMovieList(results)
    await setTotalPages(total_pages)
    await setLoading(false)
    await setError(false)
  }

  async getGenres(setGenres) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
      },
    }
    const res = await fetch('https://api.themoviedb.org/3/genre/movie/list?language=en', options)

    if (!res.ok) {
      throw new Error(`Failed to fetch genres, response: ${res.status}`)
    }
    const data = await res.json()
    const { genres } = await data
    return await setGenres(genres)
  }
}
