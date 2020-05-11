import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
    PieChart,
    Pie, Cell, Label
} from "recharts";
import React from "react";
import {DEPOSIT_COLORS, PERCENT_COLORS, PIE_COLORS} from "./constants";
import {displayRussianMonthName} from "./functions";
import DepositTable from "./components/depositTable";


const renderTooltip = () => <Tooltip formatter={v => v.toFixed(2)}
                                     itemStyle={{
                                         color: 'black',
                                         paddingLeft: '1em',
                                         paddingRight: '1em'
                                     }}
                                     labelStyle={{
                                         color: 'grey',
                                         textAlign: 'center'
                                     }}/>

export function renderBarChart(deposits, statistics, uniteStats = true) {
    return <div className="chart-block">
        <BarChart
            width={650}
            height={450}
            data={statistics}
            margin={{
                top: 20, right: 30, left: 20, bottom: 5,
            }}
            padding={{top: 10, bottom: 10}}
        >
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
            <XAxis dataKey="month" tickFormatter={displayRussianMonthName}/>
            <YAxis/>
            <Legend/>
            {renderTooltip()}
            {deposits.map((d, i) => <Bar key={i}
                                         dataKey={`deposit_value_${i + 1}`}
                                         name={`Сумма вклада ${i + 1}`}
                                         stackId={uniteStats ? "deposit" : `deposit_${i + 1}`}
                                         fill={DEPOSIT_COLORS[i]}/>
            )}
            {deposits.map((d, i) => <Bar key={`percents_${i}`}
                                         dataKey={`percents_${i + 1}`}
                                         name={`Доход ${i + 1}`}
                                         stackId={uniteStats ? "deposit" : `deposit_${i + 1}`}
                                         fill={PERCENT_COLORS[i]}/>
            )}
        </BarChart>
    </div>
}

export function renderPieChart(initialSum, statistics) {
    const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent}) => {
        const RADIAN = Math.PI / 180;
        const radius = outerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'}>
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    };

    let percents = 0
    statistics.forEach(s => {
        percents += Object.keys(s)
            .filter(stats => stats.indexOf('percents') === 0)
            .reduce((acc, val) => acc += s[val], 0)
    })
    const data = [
        {
            name: "Начисленные проценты",
            value: percents
        },
        {
            name: "Изначальная сумма",
            value: initialSum
        }
    ]
    return <div className="center-chart">
        <PieChart width={450} height={400}>
            <Pie innerRadius={110}
                 outerRadius={130}
                 data={data}
                 dataKey="value"
                 paddingAngle={5} label={renderCustomizedLabel}>
                {
                    data.map((entry, index) => <Cell
                        key={index}
                        fill={PIE_COLORS[index]}/>)
                }
                <Label value={`Всего: ${(percents + initialSum).toFixed(2)}`}
                       position="center"/>
            </Pie>
            {renderTooltip()}
        </PieChart>
    </div>
}
