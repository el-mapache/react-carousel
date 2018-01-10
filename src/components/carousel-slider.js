import React from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
  animating: React.PropTypes.bool,
  duration: React.PropTypes.number,
  onTransitionEnd: React.PropTypes.func,
  entitySize: React.PropTypes.number
};

const CarouselSlider = React.createClass({
  getInitialState() {
    return { offset: this.props.lastPosition };
  },
  shouldComponentUpdate(nextProps) {
    if (!nextProps.animating && (nextProps.active === this.props.active)) {
      return false;
    }

    return true;
  },

  animate(cb) {
    const { active, entitySize, duration } = this.props;
    const { offset } = this.state;

    const from = offset;
    const to = entitySize * this.props.active;
    const distance = Math.abs(from) - to;

    const start = new Date().getTime();
    const timer = setInterval(() => {
      const time = new Date().getTime() - start;
      let nextOffset = easeInOutQuart(time, from, distance, duration);

      this.setState({ offset: nextOffset }, function() {
        if (time >= duration) {
          clearInterval(timer);
          cb();
        }
      });
    }, 1000 / 60);

    // http://easings.net/#easeInOutQuart
    //  t: current time
    //  b: beginning value
    //  c: change in value
    //  d: duration
    function easeInOutQuart(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
      return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
    }
  },

  componentWillEnter(enterCallback) {
    this.animate(enterCallback);
  },

  componentDidEnter() {
    this.props.onTransitionEnd(this.state.offset);
  },

  render() {
    const {
      children,
      entitySize,
      translationFn,
      animating,
      lastPosition,
      axis,
    } = this.props;
    const { offset } = this.state;
    const len = children.length;
    const currentOffset = animating ? offset : lastPosition;

    const w = axis === 'x' ? entitySize * len : entitySize;
    const h = axis === 'y' ? entitySize * len : entitySize;

    const style = {
      width: `${w}px`,
      height: `${h}px`,
      overflow: 'hidden',
      transform: `${translationFn}(${currentOffset}px)`,
    };

    return (
      <div className='wrapper' style={style}>
        { children }
      </div>
    );
  }
});

CarouselSlider.propTypes = propTypes;

export default CarouselSlider;
