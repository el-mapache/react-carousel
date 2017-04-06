import React from 'react';

const ContentCell = ({ classes, content }) =>
  <div className={`cell ${classes}`}>
    <div className="cell-content">
      {content}
    </div>
  </div>

export default ContentCell;
