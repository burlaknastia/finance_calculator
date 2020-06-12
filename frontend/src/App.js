import React from 'react';
import './App.css';
import {isNumeric, sortByMonth} from "./functions";
import {renderBarChart, renderPieChart} from "./charts";
import Input from "./elements/input";
import CheckBox from "./elements/checkbox";
import Button from "./elements/button";
import InstanceAccordion from "./components/instanceAccordion";
import StatsTable from "./components/statsTable";


export default class App extends React.Component {

    state = {
        rate: '',
        value: '',
        dateFrom: '',
        dateTo: '',
        rateValid: false,
        valueValid: false,
        dateFromValid: false,
        dateToValid: false,
        instances: [],
        initialSum: 0,
        statistics: null,
        fullStatistics: null,
        compareStats: false,
        uniteStats: false,
        renderCharts: false,
    }

    validateParams = () => {
        const {rate, value, dateFrom, dateTo} = this.state
        this.setState({
            rateValid: isNumeric(rate) && parseFloat(rate) > 0,
            valueValid: isNumeric(value) && parseFloat(value) > 0,
            dateFromValid: dateFrom.length !== 0 && dateFrom < dateTo,
            dateToValid: dateTo.length !== 0 && dateFrom < dateTo,
        })
    }

    isValid = () => {
        return this.state.rateValid && this.state.valueValid
            && this.state.dateFromValid && this.state.dateToValid
    }

    setRate = (rate) => {
        this.setState({rate}, this.validateParams)
    }

    setValue = (value) => {
        this.setState({value}, this.validateParams)
    }

    setDateFrom = (dateFrom) => {
        this.setState({dateFrom}, this.validateParams)
    }

    setDateTo = (dateTo) => {
        this.setState({dateTo}, this.validateParams)
    }

    setCompareStats = () => {
        this.setState({compareStats: !this.state.compareStats})
    }

    setUniteStats = () => {
        this.setState({uniteStats: !this.state.uniteStats})
    }

    setRenderCharts = () => {
        const {instances} = this.state
        return fetch(`/api/instances`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(instances)
            })
            .then(res => res.json())
            .then(res => {
                const {statistics, full_statistics} = res
                const initialSum = instances.reduce((acc, val) => acc + parseFloat(val.value), 0)
                this.setState({
                    renderCharts: true,
                    fullStatistics: full_statistics,
                    statistics,
                    initialSum
                })
            }, err => {
                console.log('ERROR', err)
            })
    }

    addInstance = () => {
        let {rate, value, dateFrom, dateTo, instances} = this.state
        instances.push({rate, value, date_from: dateFrom, date_to: dateTo})
        const initialSum = instances.reduce((acc, val) => acc + parseFloat(val.value), 0)
        this.setState({
            instances, initialSum,
            renderCharts: false,
            rate: '', value: '',
            dateFrom: '', dateTo: ''
        }, this.validateParams)
    }

    removeInstance = (index) => {
        let {instances} = this.state
        instances.splice(index, 1)
        const initialSum = instances.reduce((acc, val) => acc + parseFloat(val.value), 0)
        this.setState({
            instances, initialSum,
            renderCharts: false,
        }, this.validateParams)
    }

    saveEditedInstance = (i, newInstance) => {
        let {instances} = this.state
        instances[i] = newInstance
        this.setState({
            instances
        })
    }

    renderCharts = () => {
        const {
            statistics, uniteStats, compareStats,
            instances, initialSum, fullStatistics
        } = this.state
        const sortedStats = sortByMonth(statistics)
        if (!uniteStats && !compareStats && instances.length > 1)
            return
        return <div style={{width: "100%"}}>
            <hr className="hr-statistics"/>
            <div className="subtitle statistics">Статистика расчета</div>
            <div className="charts-container">
                {renderPieChart(initialSum, sortedStats)}
                <div className="subtitle">Статистика по периоду</div>
                <div className="bar-chart-container">
                    {!uniteStats && !compareStats && renderBarChart(instances, sortedStats)}
                    {uniteStats && renderBarChart(instances, sortedStats)}
                    {compareStats && renderBarChart(instances, sortedStats, false)}
                </div>
                <div className="subtitle">Таблица процентов</div>
                <StatsTable fullStatistics={fullStatistics}/>
            </div>
        </div>
    }

    renderInstanceList = () => {
        return <div className="instance-list">
            {this.state.instances.map((d, i) => <InstanceAccordion
                key={i}
                i={i}
                name={`Вклад ${i + 1}`}
                title={`${d.value} со ставкой ${d.rate}% на период с ${d.date_from} по ${d.date_to}`}
                save={this.saveEditedInstance}
                removeItem={this.removeInstance}
                {...d}
            />)}
        </div>
    }

    renderParams = () => {
        return <div className="parameters">
            <div className="params-block">
                <div className="subtitle">Рассчитать cложные проценты</div>
                <Input className="input-param input-long"
                       label="Сумма"
                       value={this.state.value}
                       onChange={this.setValue}
                       error={!this.state.valueValid}
                       extraText="руб."
                />
                <Input className="input-param"
                       label="Процентная ставка"
                       value={this.state.rate}
                       onChange={this.setRate}
                       error={!this.state.rateValid}
                       extraText="%"
                />
                <div className="column-params">
                    <Input className="input-param input-date"
                           label="Дата начала"
                           value={this.state.dateFrom}
                           onChange={this.setDateFrom}
                           type='date'
                           error={!this.state.dateFromValid}
                           labelClassName="label-column"
                    />
                    <Input className="input-param input-date"
                           value={this.state.dateTo}
                           label="Дата конца"
                           onChange={this.setDateTo}
                           type='date'
                           error={!this.state.dateToValid}
                           labelClassName="label-column"
                    />
                </div>
            </div>
        </div>
    }

    renderActions = () => {
        const {instances, compareStats, uniteStats} = this.state
        return <div className="actions">
            <div className={`add-more ${!this.isValid() ? "disabled" : ''}`}>
                <hr className="hr-plus"/>
                <div className="plus-outline"
                     onClick={() => this.isValid() ? this.addInstance() : {}}>
                    <div className="plus-button"/>
                </div>
                <hr className="hr-plus"/>
            </div>

            {instances.length > 0 ? this.renderInstanceList() : null}
            {instances.length > 1
                ? <div className="column-params checks">
                    <CheckBox label="Сравнить"
                              onClick={this.setCompareStats}/>
                    <CheckBox label="Объединить"
                              onClick={this.setUniteStats}/>
                </div>
                : null
            }
            {(instances.length === 1) || (instances.length > 1 && (compareStats || uniteStats))
                ? <Button
                    value={this.state.renderCharts ? "Обновить" : "Рассчитать"}
                    onClick={this.setRenderCharts}
                />
                : null
            }
        </div>
    }

    render() {
        return <div className='calculator-page'>
            <div className="header">Финансовый калькулятор</div>
            {this.renderParams()}
            {this.renderActions()}
            {this.state.renderCharts
                ? this.renderCharts()
                : null
            }
        </div>
    }
}
