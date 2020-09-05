import React, { Component } from 'react';
import Select from 'react-select';
import './index.scss';

const format = (value) => value.map((section) => ({ value: section, label: section }));

class DropDownSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      formattedOptions: [],
    };
  }

  componentDidMount() {
    const {
      options, placeholder, multi, value,
    } = this.props;
    const formattedOptions = format(options);

    if (multi) {
      this.setState({
        formattedOptions,
        selected: format(value),
      });
    } else {
      this.setState({
        formattedOptions,
        selected: placeholder ? '' : formattedOptions[0],
      });
    }
  }

  handleChange = (selected) => {
    this.setState({ selected });
  }

  render() {
    const { placeholder, multi } = this.props;
    const { selected, formattedOptions } = this.state;
    return (
      <div>
        <Select
          value={selected}
          onChange={this.handleChange}
          options={formattedOptions}
          placeholder={placeholder}
          className="react-select-container"
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'black',
            },
          })}
          isMulti={multi}
        />
      </div>
    );
  }
}

export default DropDownSelect;
