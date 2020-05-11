import datetime
import typing as t
from dataclasses import dataclass


@dataclass(init=False)
class Deposit:
    value: int
    rate: t.Union[int, float]
    date_from: str
    date_to: str = None
    n_months: int = None

    def __init__(self, data: dict):
        try:
            self.value = float(data.get('value', 0)) if \
                '.' in data.get('value', '') else int(data.get('value', 0))
            self.rate = float(data.get('rate', 0)) if \
                '.' in data.get('rate', '') else int(data.get('rate', 0))
            self.date_from = data.get('date_from', '')
            self.date_to = data.get('date_to')
            self.n_months = int(data.get('n_months')) if \
                data.get('n_months') is not None else None
        except Exception as e:
            print(e)

    def validate(self) -> bool:
        date_valid = False
        if len(self.date_from) > 1:
            date_from = datetime.datetime.strptime(self.date_from, "%Y-%m-%d")
            if self.date_to is not None and len(self.date_to) > 0:
                date_to = datetime.datetime.strptime(self.date_to, "%Y-%m-%d")
                date_valid = date_from < date_to
            elif self.n_months is not None and self.n_months > 0:
                date_valid = True
        return self.value > 0 and self.rate > 0 and date_valid
