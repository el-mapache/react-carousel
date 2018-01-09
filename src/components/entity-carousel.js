import React from 'react';
import PropTypes from 'prop-types';
import ReactTransitionGroup from 'react-addons-transition-group';
import CarouselSlider from './carousel-slider';
import generateId from '../util/random-id';

 const DIRECTION = {
  NEXT: 'next',
  PREVIOUS: 'previous',
};

const layouts = {
  VERTICAL: 'y',
  HORIZONTAL: 'x',
};

const propTypes = {
  activeIndex: React.PropTypes.number,
  entitySize: React.PropTypes.number,
  layout: PropTypes.oneOf([
    layouts.VERTICAL,
    layouts.HORIZONTAL
  ]).isRequired,
  visible: React.PropTypes.number,
};

const isVertical = direction => direction === layouts.VERTICAL;

class EntityCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastPosition: 0,
      activeIndex: this.props.activeIndex || 0,
      direction: null,
      isTransitioning: false,
      animateKey: null, // set a unique key to flag component for animation
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
      axis: layout,
    };
  }

  incrementActiveIndexBy(increment) {
    const { children } = this.props;
    const length = children.length - 1;
    let nextIndex = this.state.activeIndex + increment;

    if (nextIndex > length) {
      nextIndex = 0;
    } else if (nextIndex < 0) {
      nextIndex = length;
    }

    return nextIndex;
  }

  moveLeft() {
    if (this.state.isTransitioning) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: generateId(14),
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
      animateKey: generateId(14),
      activeIndex: this.incrementActiveIndexBy(-1),
      direction: DIRECTION.NEXT
    });
  }

  handleTransitionEnd(lastPosition) {
    this.setState({
      isTransitioning: false,
      direction: null,
      animateKey: null,
      lastPosition,
    });
  }

  render() {
    const { state } = this;
    const { entitySize, visible } = this.props;
    const preparedProps = this.prepareProps();
    const carouselWidth = entitySize * visible;

    return (
      <div>
        <div className="entity-carousel" style={{ height: `${carouselWidth}px` }}>
          <ReactTransitionGroup>
            <CarouselSlider
              lastPosition={this.state.lastPosition}
              key={ state.animateKey }
              onTransitionEnd={ this.handleTransitionEnd }
              direction={ state.direction }
              animating={ state.isTransitioning}
              active={ state.activeIndex }
              entitySize={this.props.entitySize}
              duration={500}
              translationFn={preparedProps.translationFn}
              axis={preparedProps.axis}
            >
              { this.props.children }
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
  layout: 'y',
  visible: 1,
};

export default EntityCarousel;
