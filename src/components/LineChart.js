import React from 'react';
import { Group } from '@vx/group';
import { GridRows } from '@vx/grid'
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, Circle, Area } from '@vx/shape';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { extent, max } from 'd3-array';
import { genDateValue } from '@vx/mock-data';
import { curveLinear } from '@vx/curve'

function genLines(num) {
    return new Array(num).fill(1).map(() => {
      return genDateValue(7);
    });
}
  
const series = genLines(1);
const data = series.reduce((rec, d) => {
    return rec.concat(d);
}, []);

console.log(data)

const width = 700;
const height = 450;

const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};

const LineChart = () => {
    // accessors
    const x = d => d.date;
    const y = d => d.value;

    // bounds
    const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    // scales
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
            <Group top={margin.top} left={margin.left}>
                <Area
                    data={data}
                    x={d => xScale(x(d))}
                    y1={d => yScale(y(d))}
                    y0={d => yScale(0)}
                    fill={'rgb(5,141,199)'}
                    fillOpacity={.1}
                />

                <GridRows
                    top={0}
                    left={0}
                    scale={yScale}
                    numTicks={6}
                    stroke={'#DEE5E9'}
                    width={xMax}
                />

                <LinePath
                    data={data}
                    x={d => xScale(x(d))}
                    y={d => yScale(y(d))}
                    stroke={'#058DC7'}
                    strokeWidth={3}
                    curve={curveLinear}
                />

                {data.map((d, i) => {
                    const cx = xScale(x(d));
                    const cy = yScale(y(d));
                    return (
                        <Circle
                            key={`point-${d.value}-${i}`}
                            className="dot"
                            cx={cx}
                            cy={cy}
                            r={4}
                            fill={'#058DC7'}
                        />
                    )
                })}

                <AxisLeft
                    scale={yScale}
                    top={0}
                    left={0}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                    numTicks={6}
                    hideAxisLine={true}
                    hideZero={true}
                    hideTicks={true}
                />
        
                <AxisBottom
                    scale={xScale}
                    top={yMax}
                    stroke={'#1b1a1e'}
                    tickTextFill={'#1b1a1e'}
                    numTicks={6}
                    hideTicks={true}
                />
            </Group>
        </svg>
    );
}

export default LineChart;