export default class Ratedfilms {
  async getRatedMovies(guestSessionID, ratedCurrent, setRatedMovieList, setTotalPages, setLoading) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    }
    const api_key = '9c69142fb7448fd25c0daf725432ac2c'
    const url = `https://api.themoviedb.org/3/guest_session/${guestSessionID}/rated/movies?api_key=${api_key}&language=en-US&page=${ratedCurrent}&sort_by=created_at.asc`

    const res = await fetch(url, options)
    if (!res.ok) {
      console.log(`Failed to fetch rated movies, response: ${res.status}`)
    }
    const data = await res.json()
    const { results, total_pages } = await data
    await setRatedMovieList(results)
    await setTotalPages(total_pages)
    await setLoading(false)
  }
}
