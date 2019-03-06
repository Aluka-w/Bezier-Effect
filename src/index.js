import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
  const pointArr = [{
    startX:180,
    startY:418,
    cpoX:101,
    cpoY:236,
    cptX:190,
    cptY:226,
    endX:123,
    endY:121,
  } ]
ReactDOM.render(<App pointArr={ pointArr }/>, document.getElementById('root'));
