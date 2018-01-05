import React from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';
import CarouselSlider from './carousel-slider';

 const DIRECTION = {
  NEXT: 'next',
  PREVIOUS: 'previous',
};

const layouts = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
};

const propTypes = {
  activeIndex: React.PropTypes.number,
  entitySize: React.PropTypes.number,
  layout: PropTypes.oneOf([
    layouts.VERTICAL,
    layouts.HORIZONTAL
  ]).isRequired,
};

const isVertical = direction => direction === layouts.VERTICAL;

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

  prepareProps() {
    const { layout } = this.props;

    return {
      previousText: isVertical(layout) ? 'up' : 'left',
      nextText: isVertical(layout) ? 'down' : 'right',
      translationFn: isVertical(layout) ? 'translateY' : 'translateX',
      sliderBounds: isVertical(layout) ? 'height' : 'width'
    };
  }

  displayChildren() {
    const { state: {
      activeIndex, direction, isTransitioning
    }, props: { children } } = this;

    if (isTransitioning) {
      if (direction === DIRECTION.PREVIOUS) {
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
      direction: DIRECTION.PREVIOUS
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
      direction: DIRECTION.NEXT
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
    const preparedProps = this.prepareProps();

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
              entitySize={this.props.entitySize}
              duration={500}
              translationFn={preparedProps.translationFn}
              sliderBounds={preparedProps.sliderBounds}
            >
              { this.displayChildren() }
            </CarouselSlider>
          </ReactTransitionGroup>
        </div>
        <div className='btn-group' style={{position: 'absolute', top: '0', left: '0'}}>
          <button className='btn' onClick={ this.moveRight }>left</button>
          <button className='btn' onClick={ this.moveLeft }>right</button>
        </div>
      </div>
    );
  }
}

EntityCarousel.propTypes = propTypes;
EntityCarousel.defaultProps = {
  layout: 'vertical',
};

export default EntityCarousel;
