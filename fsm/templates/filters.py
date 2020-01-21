import json

import bleach
from fsm.util import register_filter
from jinja2.filters import do_mark_safe


@register_filter("json")
def jsonify(value):
    uncleaned = json.dumps(value)
    clean = bleach.clean(uncleaned)

    try:
        json.loads(clean)
    except Exception as err:
        raise ValueError(
            "JSON contains a quote or escape sequence that was unable to be stripped"
        ) from err

    return do_mark_safe(clean)
