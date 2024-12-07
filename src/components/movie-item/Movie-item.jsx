import { Card, Flex, Typography } from 'antd'

export default function MovieItem({ movie, image, date }) {
  if (movie.overview.length >= 250) {
    movie.overview = movie.overview.slice(0, 250)
    movie.overview = movie.overview.split(' ')
    movie.overview.pop()
    movie.overview = movie.overview.join(' ') + ' ...'
  }
  return (
    <Card
      hoverable
      style={{ width: '454px', height: '281px' }}
      styles={{ body: { padding: 0, margin: 0, overflow: 'hidden' } }}
    >
      <Flex gap={20}>
        <img width={183} height={281} alt="poster" src={image} />
        <Flex vertical gap={7}>
          <Typography.Title level={5} style={{ paddingTop: 10, margin: 0 }}>
            {movie.title}
          </Typography.Title>
          <Typography.Text type="secondary">{date}</Typography.Text>
          <Flex gap={8}>
            <Typography.Text keyboard>drama</Typography.Text>
            <Typography.Text keyboard>action</Typography.Text>
          </Flex>
          <Typography.Text>{movie.overview}</Typography.Text>
        </Flex>
      </Flex>
    </Card>
  )
}
