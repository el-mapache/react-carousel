import React from 'react';
import ReactDOM from 'react-dom';

const propTypes = {
  animating: React.PropTypes.bool,
  duration: React.PropTypes.number,
  onTransitionEnd: React.PropTypes.func,
  entityWidth: React.PropTypes.number
};

const CarouselSlider = React.createClass({
  shouldComponentUpdate(nextProps) {
    if (!nextProps.animating && (nextProps.active === this.props.active)) {
      return false;
    }

    return true;
  },

  animate(cb) {
    const { direction, entityWidth, duration } = this.props;
    const from = direction === 'right' ? -entityWidth : 0;
    const to = direction === 'left' ? -entityWidth : 0;
    const node  = ReactDOM.findDOMNode(this);

    const start = new Date().getTime();
    const timer = setInterval(function() {
      const time = new Date().getTime() - start;
      let x = easeInOutQuart(time, from, to - from, duration);
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
      if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
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

  render() {
    const { direction, children, entityWidth } = this.props;
    const x = direction && direction === 'right' ? -entityWidth : 0;
    const style = {
      width: `${this.props.children.length * entityWidth}px`,
      transform: `translateX(${x}px)`
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