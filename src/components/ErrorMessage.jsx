import { PropTypes } from 'prop-types'

export function ErrorMessage(error) {
  {
    error && (
      <section className='error'>
        <span>⚠ ⚠ ⚠</span>
        <span className='text'>{error.message}</span>
        <span>⚠ ⚠ ⚠</span>
      </section>
    )
  }
}

ErrorMessage.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
}
