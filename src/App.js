import React, { PureComponent } from 'react';
import LineAnimation from './common/LineAnimation.js';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pointList: []
    };
    this.initCanvas = this.initCanvas.bind(this);
    this.beginLineAnimations = this.beginLineAnimations.bind(this);
    this.onCanvasMouseDown = this.onCanvasMouseDown.bind(this);
  }
  componentDidMount() {
    let { pointArr } = this.props;
    this.initCanvas();
    this.timer = setTimeout(() => {
      this.beginLineAnimations(pointArr);
    }, 5000);
  }
  componentWillUnmount() {
    clearTimeout(this.timer);
  }
  render() {
    return (
      <canvas
        id="LineCanvas"
        ref={canvas => (this.canvas = canvas)}
        style={{
          background: 'rgba(0, 0, 0, 0.3)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 9
        }}
        onClick={this.onCanvasMouseDown}
      />
    );
  }
  // canvas的自适应屏幕
  initCanvas() {
    if (this.canvas) {
      let myCanvas = this.canvas;
      let clientWidth = document.documentElement.clientWidth;
      let clientHeight = document.documentElement.clientHeight;
      // let canvasHeight = Math.floor(clientHeight * 480/667);
      myCanvas.setAttribute('width', clientWidth + 'px');
      myCanvas.setAttribute('height', clientHeight + 'px');
    }
  }
  // 开始绘制曲线
  beginLineAnimations(pointArr) {
    if (this.canvas) {
      let myCanvas = document.getElementById('LineCanvas').getContext('2d');
      let canvasSize = {
        width: this.canvas.width,
        height: this.canvas.height
      };
      LineAnimation(myCanvas, canvasSize, pointArr, '3px', undefined, 0.04);
    }
  }
  // 获取canvas的贝塞尔点位(工具)
  onCanvasMouseDown(e) {
    // console.log(e.pageX, e.pageY)
    let { pointList } = this.state;
    let context = document.getElementById('LineCanvas').getContext('2d');
    let ctx = document.getElementById('LineCanvas').getContext('2d');
    let tempPoint = [e.pageX, e.pageY];
    if (pointList.length < 4) {
      pointList = [...pointList, tempPoint];
      if (pointList.length === 4) {
        console.log('在画线', pointList);
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.moveTo(pointList[0][0], pointList[0][1]);
        ctx.bezierCurveTo(
          pointList[1][0],
          pointList[1][1],
          pointList[2][0],
          pointList[2][1],
          pointList[3][0],
          pointList[3][1]
        );
        ctx.strokeStyle = 'tomato';
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.strokeStyle = 'tomato';
        context.arc(tempPoint[0], tempPoint[1], 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else {
      pointList = [];
    }
    this.setState(() => ({
      pointList: pointList
    }));
  }
}

export default App;
