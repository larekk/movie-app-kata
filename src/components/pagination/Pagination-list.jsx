import { Pagination } from 'antd'
import './pagination-list.css'

export default function PaginationList({ pages, current, onChangePage }) {
  return (
    <Pagination
      total={pages}
      align="center"
      className={'pagination'}
      onChange={onChangePage}
      current={current}
      pageSize="1"
      showSizeChanger={false}
    />
  )
}
