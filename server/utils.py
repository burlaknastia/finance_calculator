import calendar
import datetime
import typing as t

from .models import Deposit

DATE_FORMAT = "%Y-%m-%d"


def get_float_rate(rate: t.Union[int, float]) -> float:
    if rate >= 1:
        return rate / 100
    return rate


def get_days_in_year(year: int) -> int:
    return 366 if calendar.isleap(year) else 365


def get_days_for_period(delta: int, days_in_month: int) -> int:
    return delta if delta < days_in_month else days_in_month


def count_percents(initial: int, rate: float,
                   days: int, days_in_year: int) -> float:
    return initial * rate * days / days_in_year


def get_dates(date_from: str, date_to: str = None,
              number_of_months: int = None) -> tuple:
    date_from = datetime.datetime.strptime(date_from, DATE_FORMAT)
    if date_to is not None:
        date_to = datetime.datetime.strptime(date_to, DATE_FORMAT)
    elif number_of_months is not None and number_of_months > 0:
        year = date_from.year
        month = date_from.month + number_of_months
        day = date_from.day
        if month // 12 > 0:
            year += month // 12
            month = month - (month // 12 * 12)
        date_to = datetime.date(year, month, day)
    return date_from, date_to


def count_by_months(date_from: datetime, date_to: datetime,
                    deposit_value: t.Union[int, float],
                    annual_rate: float) -> t.List[dict]:
    statistics = list()
    while (date_to - date_from).days > 0:
        period_stats = dict()
        period_stats['period_start'] = date_from.strftime(DATE_FORMAT)
        period_stats['deposit_value'] = deposit_value

        days_in_month = calendar.monthrange(date_from.year, date_from.month)[1]
        days_in_year = get_days_in_year(date_from.year)

        days = get_days_for_period((date_to - date_from).days, days_in_month)
        percents = count_percents(deposit_value, annual_rate, days,
                                  days_in_year)
        deposit_value += percents
        date_from += datetime.timedelta(days=days)

        period_stats['percents'] = percents
        period_stats['days'] = days
        period_stats['period_end'] = date_from.strftime(DATE_FORMAT)
        period_stats['month'] = date_from.strftime("%B")
        statistics.append(period_stats)
    return statistics


def count_deposit_statistics(deposit: Deposit) -> t.List[dict]:
    date_from, date_to = get_dates(deposit.date_from, date_to=deposit.date_to,
                                   number_of_months=deposit.n_months)
    annual_rate = get_float_rate(deposit.rate)
    statistics = count_by_months(date_from, date_to, deposit.value,
                                 annual_rate)
    return statistics
