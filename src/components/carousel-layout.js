import React from 'react';
import PropTypes from 'prop-types';





const carouselLayout = Component => {
  const propTypes = {
    layout: PropTypes.oneOf([
      layouts.VERTICAL,
      layouts.HORIZONTAL
    ]).isRequired
  };

  return class extends React.Component {
    prepareProps() {
      const { layout } = this.props;

      return {
        previousText: isVertical(layout) ? 'up' : 'left',
        nextText: isVertical(layout) ? 'down' : 'right',
        translationFn: isVertical(layout) ? 'translateY' : 'translateX',
        sliderBounds: isVertical(layout) ? 'height' : 'width'
      };
    }

    render() {
      <Component {this.prepareProps()}
    }
  }
};

export default carouselLayout;
