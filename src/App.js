import React, { Component } from 'react';
import ContentCell from './components/content-cell';
import EntityCarousel from './components/entity-carousel';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="container">
        <EntityCarousel entityWidth={350}>
          <ContentCell classes='aubergine' content="purple"/>
          <ContentCell classes='orange' content="orange"/>
          <ContentCell classes='snow-pea' content="snowpea"/>
        </EntityCarousel>
      </div>
    );
  }
}

export default App;
