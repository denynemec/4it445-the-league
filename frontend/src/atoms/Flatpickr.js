import React from 'react';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/light.css';
import { FormFeedback, Input } from 'reactstrap';

class Flatpickr extends React.Component {
  flatpickrRef = React.createRef();

  componentDidMount() {
    const { name, value, onChange, mode, format, time } = this.props;
    this.flatpickr = flatpickr(this.flatpickrRef.current, {
      wrap: true,
      defaultDate: value,
      altInput: true,
      altFormat: 'j M Y H:i',
      dateFormat: format,
      enableTime: time,
      mode: mode,
      minDate: 'today',
      onChange: value => {
        onChange && onChange({ target: { name, value } });
      },
    });
  }

  componentDidUpdate(prevProps) {
    const { value, mode, format, time } = this.props;

    if (prevProps.mode !== mode) {
      this.flatpickr.set('mode', mode);
    }

    if (prevProps.dateFormat !== format) {
      this.flatpickr.set('dateFormat', format);
    }

    if (prevProps.enableTime !== time) {
      this.flatpickr.set('enableTime', time);
    }

    if (prevProps.value !== value) {
      this.flatpickr.setDate(value);
    }
  }

  componentWillUnmount() {
    this.flatpickr.destroy();
  }

  render() {
    const { placeholder, id, error } = this.props;
    return (
      <div className="input-group" ref={this.flatpickrRef}>
        <Input
          id={id}
          type="text"
          placeholder={placeholder}
          data-input
          invalid={error ? true : false}
          ref={this.flatpickrRef}
        />
        {error && <FormFeedback>{error}</FormFeedback>}
      </div>
    );
  }
}

export { Flatpickr };
