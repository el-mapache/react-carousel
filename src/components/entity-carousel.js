import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import CarouselSlider from './carousel-slider';

const DIRECTION = {
  RIGHT: 'right',
  LEFT: 'left'
};

class EntityCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: this.props.activeIndex || 0,
      direction: null,
      isTransitioning: false,
      animateKey: null // set a unique key to flag component for animation
    };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { state } = this;

    if ((!nextState.animateKey && !state.animateKey) ||
        nextState.activeIndex === state.activeIndex) {
      return false;
    }

    return true;
  }

  displayChildren() {
    const { state: {
      activeIndex, direction, isTransitioning
    }, props: { children } } = this;

    if (isTransitioning) {
      if (direction === DIRECTION.LEFT) {
        return [
          children[this.clampIndex(activeIndex - 1)],
          children[activeIndex]
        ];
      } else {
        return [
          children[activeIndex],
          children[this.clampIndex(activeIndex + 1)]
        ];
      }
    }

    return children[activeIndex];
  }

  clampIndex(index) {
    const { props: { children } } = this;
    let nextIndex;

    if (index > children.length - 1) {
      nextIndex = 0;
    } else if (index < 0) {
      nextIndex = children.length - 1
    } else {
      nextIndex = index;
    }

    return nextIndex;
  }

  generateAnimationKey() {
    return Math.random() * 100000000;
  }

  incrementActiveIndexBy(increment) {
    return this.clampIndex(this.state.activeIndex + increment);
  }

  moveLeft() {
    if (this.state.isTransitioning) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      activeIndex: this.incrementActiveIndexBy(1),
      direction: DIRECTION.LEFT
    });
  }

  moveRight() {
    if (this.state.isTransitioning) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      activeIndex: this.incrementActiveIndexBy(-1),
      direction: DIRECTION.RIGHT
    });
  }

  handleTransitionEnd() {
    this.setState({
      isTransitioning: false,
      direction: null,
      animateKey: null
    });
  }

  render() {
    const { state } = this;

    return (
      <div>
        <div className='entity-carousel'>
          <ReactTransitionGroup>
            <CarouselSlider
              key={ state.animateKey }
              onTransitionEnd={ this.handleTransitionEnd }
              direction={ state.direction }
              animating={ state.isTransitioning}
              active={ state.activeIndex }
              entityWidth={this.props.entityWidth}
              duration={500}
            >
              { this.displayChildren() }
            </CarouselSlider>
          </ReactTransitionGroup>
        </div>
        <div className='btn-group'>
          <button className='btn' onClick={ this.moveLeft }>left</button>
          <button className='btn' onClick={ this.moveRight }>right</button>
        </div>
      </div>
    );
  }
}

EntityCarousel.propTypes = {
  activeIndex: React.PropTypes.number,
  entityWidth: React.PropTypes.number
};

export default EntityCarousel;
