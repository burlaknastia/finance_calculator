import os
import typing as t
from multiprocessing import Pool

from flask import Flask, request, render_template, url_for
from flask_cors import CORS

from .models import Instance
from .utils import count_statistics

app = Flask('finance_calculator',
            static_folder="server/static",
            template_folder="server/templates")

CORS(app)

DEV_SERVER = os.getenv('DEV_SERVER', False)


def bundle_url() -> str:
    if DEV_SERVER:
        return "http://localhost:8080/static/main.js"
    return url_for('static', filename='main.js')


@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404


@app.route('/')
def index():
    return render_template('index.html',
                           bundle_url=bundle_url
                           ), 200


@app.route('/api/instances', methods=['POST'])
def count_multiple_instances_statistics() -> t.Tuple[dict, int]:
    payload = dict()
    instances = [Instance(d) for d in request.json]
    valid = [d.validate() for d in instances]

    if not all(valid):
        return {'error': "Ошибка в данных вклада"}, 400

    pool = Pool(processes=3)
    stats_per_instance = pool.map(count_statistics, instances)
    pool.close()

    # TODO: вынести логику
    for ind, instance_stats in enumerate(stats_per_instance):
        for month_stat in instance_stats:
            month = month_stat['month']
            stats = payload.get(month, dict())
            stats[f"instance_value_{ind + 1}"] = stats.get(f"instance_value_{ind + 1}",
                                                          month_stat['instance_value'])
            stats[f"percents_{ind + 1}"] = stats.get(f"percents_{ind + 1}", 0) + \
                                           month_stat['percents']
            payload[month] = stats

    result = [{'month': month, **stats} for month, stats in payload.items()]
    return {'statistics': result,
            'full_statistics': stats_per_instance}, 200
