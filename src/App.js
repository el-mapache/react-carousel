import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTransitionGroup from 'react-addons-transition-group';
import './App.css';

const ContentCell = React.createClass({
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    //node.style.transform = 'translateX(-350px)'
    node.addEventListener('transitionend', this.onTransition);
  },

  componentWillUnmount() {
    // const node = ReactDOM.findDOMNode(this);
    // node.classList.add('display-none')
  },

  onTransition() {
    console.log('transition over?', this.props.content)
  },

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
      isTransitioning: false,
      isTransistionStart: false,
      isTranistioning: false,
      isTransitionEnd: false,
      animateKey: null // set a unique key to flag component for animation
    };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
  }
  // we will need to know what direction the carousel is moving so we know which
  // component(s) toflag for mounting
  displayChildren() {
    const { state } = this;

    if (state.isTransitioning) {
      return [
        this.props.children[state.active - 1],
        this.props.children[state.active]
      ];
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


    //return nextActive > childCount ? childCount : nextActive;
  }

  moveLeft() {
    if (this.atLastChild()) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      active: this.getNextActive(1)
    });
  }

  moveRight() {
    if (this.atFirstChild()) {
      return;
    }

    this.setState({
      isTransitioning: true,
      animateKey: this.generateAnimationKey(),
      active: this.getNextActive(-1)
    });
  }

  handleTransitionEnd() {
    this.setState({
      isTransitioning: false,
      animateKey: null
    });
  }

  render() {
    return (
      <div>
        <div className='entity-carousel'>
          <ReactTransitionGroup>
            <Wrapper
              style={{display: 'flex', width: `${3 * 350}px`}} key={this.state.animateKey}
              onTransitionEnd={this.handleTransitionEnd}
            >
              {this.displayChildren()}
            </Wrapper>
          </ReactTransitionGroup>
        </div>
        <button onClick={this.moveLeft}>left</button>
        <button onClick={this.moveRight}>right</button>
      </div>
    );
  }
}

EntityCarousel.propTypes = {
  active: React.PropTypes.number
};

const Wrapper = React.createClass({
  componentWillEnter(enterCallback) {
    var from     = 0;
    var to       = -350;
    var duration = 1000; // 500ms
    var node  = ReactDOM.findDOMNode(this);

    var start = new Date().getTime();
    var timer = setInterval(function() {
      var time = new Date().getTime() - start;
      var x = easeInOutQuart(time, from, to - from, duration);
      node.style.transform = `translateX(${x}px)`;
      if (time >= duration) {
        clearInterval(timer);
        enterCallback();
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

  componentWillLeave(leaveCallback) {
    this.props.onTransitionEnd();
    leaveCallback();
  },

  render() {
    return (
      <div style={this.props.style}>
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
