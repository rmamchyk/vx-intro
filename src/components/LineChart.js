import React, { Component, Fragment } from 'react';
import { Group } from '@vx/group';
import { GridRows } from '@vx/grid'
import { scaleTime, scaleLinear } from '@vx/scale';
import { LinePath, Circle, Area, Bar } from '@vx/shape';
import { AxisLeft, AxisBottom } from '@vx/axis';
import { extent, max, bisector } from 'd3-array';
import { curveLinear } from '@vx/curve'
import { withTooltip } from '@vx/tooltip';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { localPoint } from '@vx/event';

var data = [
    { date: new Date(2020, 10, 7), value: 475 },
    { date: new Date(2020, 10, 8), value: 430 },
    { date: new Date(2020, 10, 9), value: 740 },
    { date: new Date(2020, 10, 10), value: 420 },
    { date: new Date(2020, 10, 11), value: 410 },
    { date: new Date(2020, 10, 12), value: 390 },
    { date: new Date(2020, 10, 13), value: 415 },
  ];

const width = 650;
const height = 300;

const margin = {
  top: 60,
  bottom: 60,
  left: 80,
  right: 80,
};

const bisectDate = bisector(d => d.date).left;

class LineChart extends Component {
    tooltip$ = new Subject();
    subscription = null;

    componentDidMount() {
        this.subscription = this.tooltip$
            .pipe(
                throttleTime(50)
            )
            .subscribe((args) => {
                this.handleTooltip(args);
            });
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
    }

    handleTooltip({ data, point, xScale, yScale }) {
        const { showTooltip } = this.props;
        const x = point.x - margin.left;

        const x0 = xScale.invert(x);

        const index = bisectDate(data, x0, 1);

        const d0 = data[index - 1];
        const d1 = data[index];
        let d = d0;

        if (d1 && d1.date) {
            d = (x0 - d0.date > d1.date - x0)
                ? d1
                : d0;
        }

        showTooltip({
            tooltipData: d,
            tooltipLeft: x,
            tooltipTop: yScale(d.value)
        });
    }

    renderTooltip(xScale, yScale, x, y) {
        const { tooltipData, hideTooltip } = this.props;
        
        console.log(tooltipData)

        const onMove = (event) => {
            const point = localPoint(event);
            console.log(point)
            this.tooltip$.next({ point, xScale, yScale, data });
        };

        return <>
            <Bar
                x={0}
                y={0}
                width={width - margin.right - margin.left}
                height={height - margin.top - margin.bottom}
                fill="transparent"
                data={data}
                onTouchStart={onMove}
                onTouchMove={onMove}
                onMouseMove={onMove}
                onMouseLeave={() => hideTooltip()}
            />
            {/* {tooltipData && (
                <MultipointMarker
                    xValue={tooltipData[dateField!]}
                    yValues={yValues}
                    xScale={xScale}
                    yScale={yScale}
                    yMax={yMax}
                    width={width - margin.left - margin.right}
                    dots={includeControl ? [0, 1] : [0]}
                    formatter={formatPercentDiff}
                />
            )} */}
        </>;
    }

    render() {
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
            domain: [0, max(data, y) * 1.5],
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
                        numTicks={4}
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
                            <Fragment key={`point-${d.value}-${i}`}>
                                <Circle
                                    className="dot"
                                    cx={cx}
                                    cy={cy}
                                    r={4}
                                    fill={'#058DC7'}
                                />
    
                                <Circle
                                    cx={cx}
                                    cy={cy}
                                    r={4.5}
                                    stroke={'rgb(0, 0, 0)'}
                                    strokeWidth={1}
                                    strokeOpacity={0.2}
                                    fillOpacity={1}
                                    fill={'none'}
                                />
                                <Circle
                                    cx={cx}
                                    cy={cy}
                                    r={5.5}
                                    stroke={'rgb(0, 0, 0)'}
                                    strokeWidth={1}
                                    strokeOpacity={0.1}
                                    fillOpacity={1}
                                    fill={'none'}
                                />
                                <Circle
                                    cx={cx}
                                    cy={cy}
                                    r={6.5}
                                    stroke={'rgb(0, 0, 0)'}
                                    strokeWidth={1}
                                    strokeOpacity={0.05}
                                    fillOpacity={1}
                                    fill={'none'}
                                />
                            </Fragment>
                        )
                    })}
    
                    <AxisLeft
                        scale={yScale}
                        top={0}
                        left={0}
                        stroke={'#1b1a1e'}
                        tickTextFill={'#1b1a1e'}
                        numTicks={4}
                        hideAxisLine={true}
                        hideZero={true}
                        hideTicks={true}
                    />

                    <AxisBottom
                        scale={xScale}
                        top={yMax}
                        stroke={'#1b1a1e'}
                        tickTextFill={'#1b1a1e'}
                        numTicks={7}
                        hideTicks={true}
                    />

                    {this.renderTooltip(xScale, yScale, x, y)}
                </Group>
            </svg>
        );
    }
}

export default withTooltip(LineChart);