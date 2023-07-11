import Spinner from 'react-spinners/RingLoader'
import { PropTypes } from 'prop-types'

export function LoadingSpinner({ loading = true }) {
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

LoadingSpinner.propTypes = {
  loading: PropTypes.bool,
}
