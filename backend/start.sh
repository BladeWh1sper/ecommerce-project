#!/bin/bash

PORT=${PORT:-8000}

exec gunicorn app.main:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:${PORT}
