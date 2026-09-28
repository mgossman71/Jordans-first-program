# Daily Spark -- Dockerfile
# A Dockerfile is a RECIPE: "here's how to build my app into a portable box."

# Start from a small, standard Python environment.
# (3.12 is current; 3.9 is past its end-of-life date.)
FROM python:3.12-slim

# The folder inside the box where our files will live.
WORKDIR /app

# First copy just the list of libraries and install them.
# Doing this in its own step lets Docker remember it (faster rebuilds later).
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the program into the box.
COPY . .

# Safety habit: make a regular (non-root) user and switch to it.
# (Our app only reads files, so it doesn't need superuser powers.)
RUN useradd -m app
USER app

# Document which port the app uses (inside the box).
EXPOSE 5000

# The command that runs when the container starts.
CMD ["python", "app.py"]