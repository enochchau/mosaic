import React, {useEffect, useState} from 'react';
import {RandomPixelSquare, RGBMinMax} from './generator';
import {Row, Column} from '../components/layout';

// parameters to tweak
// border radius
// RGB min and max
// sort length
// sort direction
// sort based on hue, saturation, or lightness
// pixel dims

// props.pixel = Pixel();
const PixelDiv = (props) => {
  const style = {
    backgroundColor: `rgb(${props.pixel.r}, ${props.pixel.g}, ${props.pixel.b}`,
    // backgroundColor: props.pixel.hex,
    height:`${props.dimension}`,
    width:`${props.dimension}`,
    borderRadius: '25%',
  }
  
  return(
    <div style={style}></div>
  );
}

const PixelApp = () => {
  const [pixelMap, setPixelMap] = useState([[]]);
  
  useEffect(() => {
    let minmax = new RGBMinMax(0,255,0,255,0,255)
    let data = new RandomPixelSquare(60, minmax);
    data.sortHueVertical();
    setPixelMap(data.data)
  },[])

  const render = pixelMap.map((inner,i) => {
    return(
      <Row key={i}>
        {inner.map((p,i) => <PixelDiv pixel={p} dimension='12px'/>)}
      </Row>
    );
  });

  return(
    <Column>
      {render}
    </Column>
  );
}

export default PixelApp;