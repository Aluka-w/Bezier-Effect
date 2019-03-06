/**
 * 数据轨迹动画
 * @param ctx 画布2d对象
 * @param canvasSize 画布大小
 * @param pointArr Array 三次贝塞尔曲线的4个控制点
 * @param lineWidth Number 最粗位置的线条宽度
 * @param lineColor String 颜色值
 * @param speed Number 速度  t值的递增值
 * @param scale Number 画布缩放
 * @param speedT Number 多倍打点，抗锯齿（倍数太高会导致动画卡顿，建议1-5之间）
 */
const LineAnimation = (ctx, canvasSize, pointArr, lineWidth="2px", lineColor="#0086fb", speed=0.02, scale = 1, speedT = 2) => {
  ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
  ctx.strokeStyle = lineColor || 'rgba(0,0,0,1)';
  ctx.lineJoin = 'round';
  ctx.lineCap = "round";
  lineWidth = parseInt(lineWidth) * scale;

  /**
   * 绘制2点的线段
   * @param ctx
   * @param x1  起始点x
   * @param y1  起始点y
   * @param x2  结束点x
   * @param y2  结束点y
   * @param lw  线宽
   */
  let draw = (ctx, x1, y1, x2, y2, lw) => {
    if (x1 || y1) ctx.moveTo(x1, y1);
    if (x2 || y2) ctx.lineTo(x2, y2);
  };

  let minX, minY, maxX, maxY; //记录曲线的最小矩形区域
  //缓存贝塞尔曲线的所有绘制点
  let drawPoint = pointArr.map((item) => {
    item.startX = item.startX / canvasSize.width * (canvasSize.width * scale);
    item.cpoX = item.cpoX / canvasSize.width * (canvasSize.width * scale);
    item.cptX = item.cptX / canvasSize.width * (canvasSize.width * scale);
    item.endX = item.endX / canvasSize.width * (canvasSize.width * scale);

    item.startY = item.startY / canvasSize.width * (canvasSize.width * scale);
    item.cpoY = item.cpoY / canvasSize.width * (canvasSize.width * scale);
    item.cptY = item.cptY / canvasSize.width * (canvasSize.width * scale);
    item.endY = item.endY / canvasSize.width * (canvasSize.width * scale);
    // console.log(item);
    let pointArr = [];
    for (let t = 0; t < 1; t += speed / speedT) {
      let x = (1 - t) * (1 - t) * (1 - t) * item.startX + 3 * t * (1 - t) * (1 - t) * item.cpoX + 3 * t * t * (1 - t) * item.cptX + item.endX * t * t * t;
      let y = (1 - t) * (1 - t) * (1 - t) * item.startY + 3 * t * (1 - t) * (1 - t) * item.cpoY + 3 * t * t * (1 - t) * item.cptY + item.endY * t * t * t;
      if (minX === undefined) {
        minX = x - lineWidth;
        maxX = x + lineWidth;
        minY = y - lineWidth;
        maxY = y + lineWidth;
      } else {
        if (x < minX) minX = x - lineWidth;
        else if (x > maxX) maxX = x + lineWidth;
        if (y < minY) minY = y - lineWidth;
        else if (y > maxY) maxY = y + lineWidth;
      }
      pointArr.push({
        x,
        y
      });
    }
    return pointArr;
  });
  let drawMap = {}

  function pushDraw(x, y, oldX, oldY, lw) {
    if (!lw) return;
    if (drawMap[lw]) {
      drawMap[lw].push({
        x,
        y,
        oldX,
        oldY
      });
    } else {
      drawMap[lw] = [{
        x,
        y,
        oldX,
        oldY
      }];
    }
  }

  //启动
  function start() {
    let endIndex = 0; //结束绘制点
    let startIndex = 0; //起始位置点
    let timer = window.requestAnimationFrame(step)
    //绘制步骤控制
    function step() {
      drawMap = {}
      ctx.clearRect(minX, minY, maxX - minX, maxY - minY);

      let centerIndex = endIndex - startIndex > 0 ? parseInt((endIndex - startIndex) / 2 + startIndex) : 0;
      drawPoint.forEach((item, i) => {
        let oldx = null;
        let oldy = null;
        for (let _index = startIndex; _index <= endIndex; _index++) {
          let _indexEnd = _index + speedT;
          for (let __index = _index; __index < _indexEnd; __index++) {
            let lineItem = item[__index];
            let tempIndex = __index <= centerIndex ? __index : (endIndex + startIndex - __index);
            let lw = Math.round((tempIndex - startIndex) / (centerIndex - startIndex) * lineWidth);
            lw = lw && lw > 0 ? lw : 0;
            // draw(ctx,lineItem.x,lineItem.y,oldx,oldy,lw);
            pushDraw(lineItem.x, lineItem.y, oldx, oldy, lw);
            // ctx.restore();
            oldx = lineItem.x;
            oldy = lineItem.y;
          }
          //ctx.restore();

        }
      });
      for (let lw in drawMap) {
        ctx.beginPath();
        let drawArr = drawMap[lw];
        drawArr.forEach((v) => {
          let {
            x,
            y,
            oldX,
            oldY
          } = v;
          draw(ctx, x, y, oldX, oldY, lw);
        });
        ctx.lineWidth = lw;
        ctx.stroke();
      }

      // ctx.closePath();
      if (endIndex === drawPoint[0].length - speedT) {
        startIndex += speedT;
      } else {
        endIndex += speedT;
      }
      if (endIndex === drawPoint[0].length - speedT && endIndex === startIndex) {
        ctx.clearRect(minX, minY, maxX - minX, maxY - minY);
        window.cancelAnimationFrame(timer);
      } else {
        timer = window.requestAnimationFrame(step)
      }
    }

  }
  start();
}
export default LineAnimation
