import Spinner from 'react-spinners/RingLoader'

export const LoadingSpinner = ({ loading }) => {
  return (
    <Spinner
      className='spinner'
      color='orange'
      loading={loading}
      size={200}
      aria-label='Loading Spinner'
      data-testid='loader'
    />
  )
}
