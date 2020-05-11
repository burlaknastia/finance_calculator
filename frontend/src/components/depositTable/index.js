import React, {useState} from "react";
import './styles.css'
import {DEPOSIT_COLORS} from "../../constants";


export default function DepositTable(props) {
    const [groupingMode, setGroupingMode] = useState(false)

    const headers = ["period_start", "period_end", "deposit_value", "percents"]

    const stats = groupingMode
        ? props.fullStatistics
        : props.fullStatistics
            .reduce((acc, val, ind) => {
                const valIndex = val.map(v => {
                    return {...v, index: ind}
                })
                return acc = [...acc, ...valIndex]
            }, [])
            .sort((a, b) => new Date(a.period_start) - new Date(b.period_start))

    const fix = (val) => {
        if (typeof val === 'number')
            return val.toFixed(2)
        return val
    }

    return <div className="center-chart">
        <table className="deposit-table">
            <tbody>
            <tr className="table-row">
                <th className="table-header header-date">Дата начала</th>
                <th className="table-header header-date">Дата конца</th>
                <th className="table-header">Сумма вклада</th>
                <th className="table-header">Начисленный процент</th>
            </tr>
            {stats.map((st, ind) =>
                <tr className="table-row"
                    style={{backgroundColor: DEPOSIT_COLORS[st['index']] + '2e'}}
                    key={ind}>
                    {headers.map(h =>
                        <td className="table-cell"
                            key={h}>
                            {fix(st[h])}
                        </td>)}
                </tr>)}
            </tbody>
        </table>
    </div>
}
