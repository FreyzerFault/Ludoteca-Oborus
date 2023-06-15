export function BoardGameCard({ data }) {
  return (
    <div className='boardgame-card'>
      <img src={data.thumbnail} alt={`${data.name} Thumbnail`} />
      <p className='name'>{data.name}</p>
    </div>
  )
}
