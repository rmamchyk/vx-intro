import React from 'react';
import { appleStock } from '@vx/mock-data';
import { Group } from '@vx/group';
import { scaleTime, scaleLinear } from '@vx/scale';
import { Area } from '@vx/shape';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { LinearGradient } from '@vx/gradient';
import { extent, max } from 'd3-array';

const data = appleStock;

const width = 800;
const height = 500;

const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};

const AreaChart = () => {
    const x = d => new Date(d.date);
    const y = d => d.close;

    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    const xScale = scaleTime({
        domain: extent(data, x),
        range: [0, xMax]
    });
    const yScale = scaleLinear({
        domain: [0, max(data, y)],
        range: [yMax, 0]
    });

    return (
        <svg width={width} height={height}>
            <LinearGradient
                from='#fbc2eb'
                to='#a6c1ee'
                id='gradient'
            />
    
            <Group top={margin.top} left={margin.left}>
                <Area
                    data={data}
                    x={d => xScale(x(d))}
                    y1={d => yScale(y(d))}
                    y0={d => yScale(0)}
                    fill={"url(#gradient)"}
                />
        
                <AxisLeft
                    scale={yScale}
                    top={0}
                    left={0}
                    label={'Close Price ($)'}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                />
        
                <AxisBottom
                    scale={xScale}
                    top={yMax}
                    label={'Years'}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                />
            </Group>
        </svg>
    );
}

export default AreaChart;