# -*- coding: utf-8 -*-
"""
Daily Spark  --  Jordan's first program!

This file is the BRAIN of the app. It runs a tiny web server (built with a
popular Python library called Flask).

When your browser visits the main address ("/"), this code:
  1. picks a random "spark"  (an idea + its matching picture)
  2. makes sure it's NOT the same one you just saw
  3. sends that spark to your screen

Every time you reload, you get a fresh spark. That's the magic!
"""

import random

from flask import Flask, render_template
from sparks import SPARKS   # our list of ideas + images (lives in sparks.py)

# "Turn on the web server." This object handles every request from browsers.
app = Flask(__name__)

# A little server memory: which spark we showed most recently.
_last_index = None


@app.route("/")            # runs this function when the browser visits "/"
def home():
    global _last_index

    # If we have more than one spark, don't immediately repeat the last one.
    if len(SPARKS) > 1 and _last_index is not None:
        choices = [i for i in range(len(SPARKS)) if i != _last_index]
    else:
        choices = list(range(len(SPARKS)))

    index = random.choice(choices)   # pick one at random
    _last_index = index              # remember it, so we can avoid repeats

    # Send the page back, filled in with this spark.
    return render_template("index.html", spark=SPARKS[index])


if __name__ == "__main__":
    # This runs when the app starts:  python app.py
    #   host="0.0.0.0"  -> reachable from outside the container
    #   port=5000       -> the address it listens on (inside the container)
    app.run(host="0.0.0.0", port=5000)