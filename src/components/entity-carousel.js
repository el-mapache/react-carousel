import React from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';
import CarouselSlider from './carousel-slider';

const DIRECTION = {
  NEXT: 'next',
  PREVIOUS: 'previous'
};

const layouts = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

const propTypes = {
  activeIndex: PropTypes.number,
  entitySize: PropTypes.number,
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

    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
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
      if (direction === DIRECTION.NEXT) {
        return [
          children[this.clampIndex(activeIndex + 1)],
          children[activeIndex],

        ];
      } else {
        console.log('activeindex + 1', activeIndex + 1, children[this.clampIndex(activeIndex + 1)].props);
        console.log('activeindex - 1', activeIndex - 1, children[this.clampIndex(activeIndex - 1)].props);
        console.log('activeindex', activeIndex, children[this.clampIndex(activeIndex)].props);
        return [
          children[this.clampIndex(activeIndex)],
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

  previous() {
    if (this.state.isTransitioning) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      activeIndex: this.incrementActiveIndexBy(-1),
      direction: DIRECTION.PREVIOUS
    });
  }

  next() {
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
      animateKey: null,
    });
  }

  render() {
    const { state } = this;

    return (
      <div>
        <div className='entity-carousel' style={{width: '1050px'}}>
          <ReactTransitionGroup>
            <CarouselSlider
              key={ state.animateKey }
              onTransitionEnd={ this.handleTransitionEnd }
              direction={ state.direction }
              animating={ state.isTransitioning}
              active={ state.activeIndex }
              entitySize={this.props.entitySize}
              duration={500}
            >
              { this.displayChildren() }
            </CarouselSlider>
          </ReactTransitionGroup>
        </div>
        <div className='btn-group'>
          <button className='btn' onClick={ this.previous }>left</button>
          <button className='btn' onClick={ this.next }>right</button>
        </div>
      </div>
    );
  }
}

EntityCarousel.propTypes = propTypes;
EntityCarousel.defaultProps = {
  layout: 'horizontal',
};

export default EntityCarousel;
