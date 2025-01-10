import { Card, Flex, Typography, Rate } from 'antd'
import './movie-item.css'

import { ContextGenres } from '../genres-context/genres-context'

export default function MovieItem({ movie, movieId, image, date, rate, colorRate, rateFilm, myRate, movieGenres }) {
  if (movie.overview.length >= 280) {
    movie.overview = movie.overview.slice(0, 280)
    movie.overview = movie.overview.split(' ')
    movie.overview.pop()
    movie.overview = movie.overview.join(' ') + ' ...'
  }

  if (movie.title.length >= 42) {
    movie.title = movie.title.slice(0, 42)
    movie.title = movie.title.split(' ')
    movie.title.pop()
    movie.title = movie.title.join(' ') + ' ...'
  }

  let movieCard

  function mediaChange(width) {
    if (width.matches) {
      return (movieCard = (
        <ContextGenres.Consumer>
          {(genres) => {
            return (
              <Card
                hoverable
                style={{ width: '388px', minHeight: '245px', margin: '0 auto' }}
                styles={{ body: { padding: 0, margin: 0, overflow: 'hidden' } }}
              >
                <Flex gap={10}>
                  <img width={60} height={91} alt="poster" src={image} />
                  <Flex vertical gap={7} style={{ position: 'relative', width: '100%' }}>
                    <Flex justify="space-between" style={{ paddingTop: 2, paddingRight: 2 }}>
                      <Typography.Title level={5} style={{ margin: 0, maxWidth: 210 }} className={'font'}>
                        {movie.title}
                      </Typography.Title>
                      <Typography.Text
                        className={'fontOverview'}
                        style={{
                          paddingTop: 6.5,
                          width: 35,
                          height: 35,
                          textAlign: 'center',
                          border: `${colorRate} solid 2px`,
                          borderRadius: '100%',
                        }}
                      >
                        {rate}
                      </Typography.Text>
                    </Flex>
                    <Typography.Text type="secondary" className={'fontOverview'} style={{ marginTop: -10 }}>
                      {date}
                    </Typography.Text>
                    <Flex gap={4} wrap>
                      {genres ? (
                        movieGenres.map((movieGenre) => {
                          return (
                            <Typography.Text keyboard key={movieGenre} className={'fontOverview'}>
                              {genres.map((genre) => {
                                if (genre.id === movieGenre) {
                                  return genre.name
                                }
                              })}
                            </Typography.Text>
                          )
                        })
                      ) : (
                        <Typography.Text keyboard className={'fontOverview'}>
                          No genres Information
                        </Typography.Text>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex style={{ marginTop: 10, paddingBottom: 50 }}>
                  <Typography.Text className={'fontOverview'}>{movie.overview}</Typography.Text>
                  <Rate
                    count={10}
                    defaultValue={myRate ? myRate : 0}
                    allowHalf
                    style={{ position: 'absolute', bottom: '10px', right: '5px' }}
                    onChange={(e) => {
                      const rateOptions = {
                        method: 'POST',
                        headers: {
                          accept: 'application/json',
                          'Content-Type': 'application/json;charset=utf-8',
                          Authorization:
                            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
                        },
                        body: `{"value":${e}}`,
                      }
                      rateFilm(rateOptions, movieId)
                    }}
                  ></Rate>
                </Flex>
              </Card>
            )
          }}
        </ContextGenres.Consumer>
      ))
    } else {
      movieCard = (
        <ContextGenres.Consumer>
          {(genres) => {
            return (
              <Card
                hoverable
                style={{ width: '482px', height: '281px', margin: '0 auto' }}
                styles={{ body: { padding: 0, margin: 0, overflow: 'hidden' } }}
              >
                <Flex gap={20}>
                  <img width={183} height={281} alt="poster" src={image} />
                  <Flex vertical gap={7} style={{ position: 'relative', width: '100%' }}>
                    <Flex justify="space-between" style={{ paddingTop: '10px', paddingRight: '10px' }}>
                      <Typography.Title
                        level={5}
                        style={{ margin: 0, paddingTop: 5, maxWidth: 210 }}
                        className={'font'}
                      >
                        {movie.title}
                      </Typography.Title>
                      <Typography.Text
                        className={'fontOverview'}
                        style={{
                          paddingTop: 6.5,
                          width: 35,
                          height: 35,
                          textAlign: 'center',
                          border: `${colorRate} solid 2px`,
                          borderRadius: '100%',
                        }}
                      >
                        {rate}
                      </Typography.Text>
                    </Flex>
                    <Typography.Text type="secondary" className={'fontOverview'}>
                      {date}
                    </Typography.Text>
                    <Flex gap={4} wrap>
                      {genres ? (
                        movieGenres.map((movieGenre) => {
                          return (
                            <Typography.Text keyboard key={movieGenre} className={'fontOverview'}>
                              {genres.map((genre) => {
                                if (genre.id === movieGenre) {
                                  return genre.name
                                }
                              })}
                            </Typography.Text>
                          )
                        })
                      ) : (
                        <Typography.Text keyboard className={'fontOverview'}>
                          No genres Information
                        </Typography.Text>
                      )}
                    </Flex>
                    <Typography.Text className={'fontOverview'}>{movie.overview}</Typography.Text>
                    <Rate
                      count={10}
                      defaultValue={myRate ? myRate : 0}
                      allowHalf
                      style={{ position: 'absolute', bottom: '10px', right: '5px' }}
                      onChange={(e) => {
                        const rateOptions = {
                          method: 'POST',
                          headers: {
                            accept: 'application/json',
                            'Content-Type': 'application/json;charset=utf-8',
                            Authorization:
                              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YzY5MTQyZmI3NDQ4ZmQyNWMwZGFmNzI1NDMyYWMyYyIsIm5iZiI6MTczMjI3OTUwMC41Nzg2ODY1LCJzdWIiOiI2NzNiNmZkN2M2NDEyYjM2Njk2NTQ5NzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0Pr_lPoWZC_O62P8yuxcs9W_kDVLu0_wA0skzHocox4',
                          },
                          body: `{"value":${e}}`,
                        }
                        rateFilm(rateOptions, movieId)
                      }}
                    ></Rate>
                  </Flex>
                </Flex>
              </Card>
            )
          }}
        </ContextGenres.Consumer>
      )
    }
  }

  let width = window.matchMedia('(max-width: 500px)')

  mediaChange(width)

  return movieCard
}
