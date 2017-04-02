import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import './App.css';

const ContentCell = React.createClass({
  render() {
    const { props: { classes, content } } = this

    return (
      <div className={`cell ${classes}`}>
        <div className="cell-content">
          {content}
        </div>
      </div>
    );
  }
});

class EntityCarousel extends React.Component {
  constructor(props) {
    super(props);

    // have to store current active and last active
    this.state = {
      active: this.props.active || 0,
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
    if (!nextState.animateKey && !state.animateKey) {
      return false;
    }

    return true;
  }

  // we will need to know what direction the carousel is moving so we know which
  // component(s) toflag for mounting
  displayChildren() {
    const { state } = this;

    if (state.isTransitioning) {
      if (state.direction === 'left') {
        return [
          this.props.children[state.active - 1],
          this.props.children[state.active]
        ];
      } else if (state.direction === 'right') {
        return [
          this.props.children[state.active],
          this.props.children[state.active + 1]
        ];
      }
    }

    return this.props.children[state.active];
  }

  atLastChild() {
    return this.state.active === this.props.children.length - 1;
  }

  atFirstChild() {
    return this.state.active === 0;
  }

  generateAnimationKey() {
    return Math.random() * 100000000;
  }

  getNextActive(increment) {
    return this.state.active + increment;
  }

  moveLeft() {
    if (this.atLastChild() || this.state.isTransitioning) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      active: this.getNextActive(1),
      lastActive: this.state.active,
      direction: 'left'
    });
  }

  moveRight() {
    if (this.atFirstChild() || this.state.isTransitioning) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      active: this.getNextActive(-1),
      lastActive: this.state.active,
      direction: 'right'
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
    return (
      <div>
        <div className='entity-carousel'>
          <ReactTransitionGroup>
            { this.state.isTransitioning ?
            <Wrapper
              animateKey={ this.state.animateKey }
              key={ this.state.animateKey }
              onTransitionEnd={ this.handleTransitionEnd }
              direction={ this.state.direction }
              animating={ this.state.isTransitioning}
              active={this.state.active}
              lastActive={this.state.lastActive}
            >
              { this.displayChildren() }
            </Wrapper> : this.displayChildren()}
          </ReactTransitionGroup>
        </div>
        <button onClick={ this.moveLeft }>left</button>
        <button onClick={ this.moveRight }>right</button>
      </div>
    );
  }
}

EntityCarousel.propTypes = {
  active: React.PropTypes.number
};

let Wrapper = React.createClass({
  shouldComponentUpdate(nextProps) {
    if (!nextProps.animating && (nextProps.active === this.props.active)) {
      return false;
    }

    return true;
  },

  animate(cb) {
    const { direction } = this.props;

    var from     = direction === 'right' ? -350 : 0;
    var to       = direction === 'left' ? -350 : 0;
    var duration = 850; // 500ms
    var node  = ReactDOM.findDOMNode(this);

    var start = new Date().getTime();
    var timer = setInterval(function() {
      var time = new Date().getTime() - start;
      var x = easeInOutQuart(time, from, to - from, duration);
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

  componentDidLeave() {
  },

  render() {
    const { direction } = this.props;
    const x = direction && direction === 'right' ? -350 : 0;
    const style = {
      width: `${this.props.children.length * 350}px`,
      transform: `translateX(${x}px)`
    };

    return (
      <div style={style}>
        { this.props.children }
      </div>
    );
  }
});

class App extends Component {
  render() {
    return (
      <div className="container">
        <EntityCarousel>
          <ContentCell classes='aubergine' content="purple"/>
          <ContentCell classes='orange' content="orange"/>
          <ContentCell classes='snow-pea' content="snowpea"/>
        </EntityCarousel>
      </div>
    );
  }
}

export default App;
