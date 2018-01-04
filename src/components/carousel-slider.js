import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

const propTypes = {
  animating: PropTypes.bool,
  duration: PropTypes.number,
  onTransitionEnd: PropTypes.func,
  layout: PropTypes.string,
  entitySize: PropTypes.number // rename this to entitySize
};

const CarouselSlider = React.createClass({
  shouldComponentUpdate(nextProps) {
    if (!nextProps.animating && (nextProps.active === this.props.active)) {
      return false;
    }

    return true;
  },

  getOffset(direction, size) {
    let offset;

    if (direction) {
      if (direction === 'previous') {
        offset = -size;
      } else {
        offset = size;
      }
    } else {
      offset = 0;
    }

    return offset;
  },

  animate(cb) {
    const { direction, entitySize, duration } = this.props;
    const from = this.getOffset(direction, entitySize);
    const to = this.getOffset(direction, -entitySize);
    const node  = ReactDOM.findDOMNode(this);
debugger
    const start = new Date().getTime();
    const timer = setInterval(function() {
      const time = new Date().getTime() - start;
      let x = easeInOutQuart(time, from, from - to, duration);
      node.style.transform = `translateX(${x}px)`;

      if (time >= duration) {
        clearInterval(timer);
        cb();
      }
    }, 1000 / 60);


    // http://easings.net/#easeInOutQuart
    //  t: current time
    //  b: beginning value
    //  c: change in value
    //  d: duration
    function easeInOutQuart(t, b, c, d) {
      if ((t /= d / 2) < 1) {
        return c / 2 * t * t * t * t + b;
      }

      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
  },

  componentWillEnter(enterCallback) {
    this.animate(enterCallback);
  },

  componentDidEnter() {
    this.props.onTransitionEnd();
  },

  componentWillLeave(leaveCallback) {
    leaveCallback();
  },

  componentDidLeave() {},

  lengthOfChildren() {
    const { children } = this.props;

    return children instanceof Array ? children.length : 1;
  },

  render() {
    const { direction, children, entitySize } = this.props;
    const width = `${this.lengthOfChildren() * entitySize}`;
    let x;

    if (direction) {
      if (direction === 'previous') {
        x = -width;
      } else {
        x = width;
      }
    } else {
      x = 0;
    }

    const style = {
      width: `${width}px`,
      transform: `translateX(0px)`
    };
    console.log('next style?', direction, style)
    return (
      <div className='wrapper' style={style}>
        { children }
      </div>
    );
  }
});

CarouselSlider.propTypes = propTypes;

export default CarouselSlider;
