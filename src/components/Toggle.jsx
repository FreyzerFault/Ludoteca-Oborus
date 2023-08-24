import PropTypes from 'prop-types'

import '../styles/Toggle.css'

export function Toggle({
  checked = false,
  onChecked = () => {},
  disabled = false,
  uncheckedComponent,
  checkedComponent,
}) {
  const handleChecked = (e) => {
    onChecked(!checked)
  }

  return (
    <button
      onClick={handleChecked}
      className={`toggle ${checked ? 'toggle-checked' : 'toggle-unchecked'}`}
    >
      <label htmlFor='toggle'>
        {checked && checkedComponent}
        {!checked && uncheckedComponent}
      </label>
      <input
        type='checkbox'
        name='toggle'
        checked={checked}
        onChange={handleChecked}
        disabled={disabled}
      />
    </button>
  )
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChecked: PropTypes.func,
  disabled: PropTypes.bool,
  uncheckedComponent: PropTypes.element,
  checkedComponent: PropTypes.element,
}
