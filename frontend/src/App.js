import React from 'react';
import './App.css';
import {isNumeric, sortByMonth} from "./functions";
import {renderBarChart, renderPieChart} from "./charts";
import Input from "./elements/input";
import CheckBox from "./elements/checkbox";
import Button from "./elements/button";
import DepositAccordion from "./components/depositAccordion";
import DepositTable from "./components/depositTable";


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
        deposits: [],
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
        const {deposits} = this.state
        return fetch(`/api/deposits`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(deposits)
            })
            .then(res => res.json())
            .then(res => {
                const {statistics, full_statistics} = res
                const initialSum = deposits.reduce((acc, val) => acc + parseFloat(val.value), 0)
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

    addDeposit = () => {
        let {rate, value, dateFrom, dateTo, deposits} = this.state
        deposits.push({rate, value, date_from: dateFrom, date_to: dateTo})
        const initialSum = deposits.reduce((acc, val) => acc + parseFloat(val.value), 0)
        this.setState({
            deposits, initialSum,
            renderCharts: false,
            rate: '', value: '',
            dateFrom: '', dateTo: ''
        }, this.validateParams)
    }

    removeDeposit = (index) => {
        let {deposits} = this.state
        deposits.splice(index, 1)
        const initialSum = deposits.reduce((acc, val) => acc + parseFloat(val.value), 0)
        this.setState({
            deposits, initialSum,
            renderCharts: false,
        }, this.validateParams)
    }

    saveEditedDeposit = (i, newDeposit) => {
        let {deposits} = this.state
        deposits[i] = newDeposit
        this.setState({
            deposits
        })
    }

    renderCharts = () => {
        const {
            statistics, uniteStats, compareStats,
            deposits, initialSum, fullStatistics
        } = this.state
        const sortedStats = sortByMonth(statistics)
        if (!uniteStats && !compareStats && deposits.length > 1)
            return
        return <div style={{width: "100%"}}>
            <hr className="hr-statistics"/>
            <div className="subtitle statistics">Статистика расчета</div>
            <div className="charts-container">
                {renderPieChart(initialSum, sortedStats)}
                <div className="subtitle">Статистика по месяцам</div>
                <div className="bar-chart-container">
                    {!uniteStats && !compareStats && renderBarChart(deposits, sortedStats)}
                    {uniteStats && renderBarChart(deposits, sortedStats)}
                    {compareStats && renderBarChart(deposits, sortedStats, false)}
                </div>
                <div className="subtitle">График выплат процентов</div>
                <DepositTable fullStatistics={fullStatistics}/>
            </div>
        </div>
    }

    renderDepositList = () => {
        return <div className="deposit-list">
            {this.state.deposits.map((d, i) => <DepositAccordion
                key={i}
                i={i}
                name={`Вклад ${i + 1}`}
                title={`${d.value} под ${d.rate}% годовых на период с ${d.date_from} по ${d.date_to}`}
                save={this.saveEditedDeposit}
                removeItem={this.removeDeposit}
                {...d}
            />)}
        </div>
    }

    renderParams = () => {
        return <div className="parameters">
            <div className="params-block">
                <div className="subtitle">Рассчитать доходность вклада</div>
                <Input className="input-param input-long"
                       label="Сумма"
                       value={this.state.value}
                       onChange={this.setValue}
                       error={!this.state.valueValid}
                       extraText="руб."
                />
                <Input className="input-param"
                       label="Ставка"
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
        const {deposits, compareStats, uniteStats} = this.state
        return <div className="actions">
            <div className={`add-more ${!this.isValid() ? "disabled" : ''}`}>
                <hr className="hr-plus"/>
                <div className="plus-outline"
                     onClick={() => this.isValid() ? this.addDeposit() : {}}>
                    <div className="plus-button"/>
                </div>
                <hr className="hr-plus"/>
            </div>

            {deposits.length > 0 ? this.renderDepositList() : null}
            {deposits.length > 1
                ? <div className="column-params checks">
                    <CheckBox label="Сравнить"
                              onClick={this.setCompareStats}/>
                    <CheckBox label="Объединить"
                              onClick={this.setUniteStats}/>
                </div>
                : null
            }
            {(deposits.length === 1) || (deposits.length > 1 && (compareStats || uniteStats))
                ? <Button
                    value={this.state.renderCharts ? "Обновить" : "Рассчитать"}
                    onClick={this.setRenderCharts}
                />
                : null
            }
        </div>
    }

    render() {
        return <div className='deposit-page'>
            <div className="header">Калькулятор доходности
                вкладов
            </div>
            {this.renderParams()}
            {this.renderActions()}
            {this.state.renderCharts
                ? this.renderCharts()
                : null
            }
        </div>
    }
}
