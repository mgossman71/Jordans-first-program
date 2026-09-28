# -*- coding: utf-8 -*-
"""
Daily Spark  --  Jordan's first program!

This file is the BRAIN of the app. It runs a tiny web server (built with a
popular Python library called Flask).

When your browser visits the main address ("/"), this code:
  1. picks a random "spark"  (an idea + its matching picture)
  2. makes sure it's NOT the same one you just saw
     (the page passes last time's number along as a tiny hint in the address)
  3. sends that spark to your screen

Every time you reload, you get a fresh spark. That's the magic!
"""

import random

from flask import Flask, render_template, request
from sparks import SPARKS   # our list of ideas + images (lives in sparks.py)

# Fail fast at startup (with a clear message) if the list is ever empty.
if not SPARKS:
    raise SystemExit("sparks.py has no sparks -- add at least one to the SPARKS list!")

# "Turn on the web server." This object handles every request from browsers.
app = Flask(__name__)


@app.route("/")            # runs this function when the browser visits "/"
def home():
    # The address can carry a little hint:  ?prev=3   ("you saw spark #3 last").
    # We use it to avoid showing the same spark twice in a row.
    # (Keeping it in the address, instead of in server memory, means it works
    #  even if the app ever runs on several machines at once.)
    prev = request.args.get("prev")

    if len(SPARKS) > 1 and prev is not None:
        try:
            prev = int(prev)          # not a number? just ignore the hint
        except (TypeError, ValueError):
            prev = None
        if prev is not None and 0 <= prev < len(SPARKS):
            choices = [i for i in range(len(SPARKS)) if i != prev]
        else:
            choices = list(range(len(SPARKS)))
    else:
        choices = list(range(len(SPARKS)))

    index = random.choice(choices)   # pick one at random

    # Send the page back, filled in with this spark (and its number, so the
    # "Another spark" button can hand it back to us as ?prev=).
    return render_template("index.html", spark=SPARKS[index], index=index)


if __name__ == "__main__":
    # This runs when the app starts:  python app.py
    #   host="0.0.0.0"  -> reachable from outside the container
    #   port=5000       -> the address it listens on (inside the container)
    app.run(host="0.0.0.0", port=5000)