.DEFAULT_GOAL := help
SHELL := /bin/bash

PYTHON ?= python3.14
NPM ?= npm

BACKEND_PYTHON := .venv/bin/python
BACKEND_COMMAND = cd backend && $(BACKEND_PYTHON) -m uvicorn app:app --reload
FRONTEND_COMMAND = cd frontend && $(NPM) run dev

.PHONY: help setup setup-backend setup-frontend dev backend frontend health lint build

help:
	@printf '%s\n' \
		'make setup     Install backend and frontend dependencies' \
		'make dev       Run both development servers (Ctrl+C stops both)' \
		'make backend   Run the FastAPI development server' \
		'make frontend  Run the Vite development server' \
		'make health    Check the running backend' \
		'make lint      Lint the frontend' \
		'make build     Build the frontend for production'

setup: setup-backend setup-frontend

setup-backend: backend/$(BACKEND_PYTHON)
	cd backend && $(BACKEND_PYTHON) -m pip install -r requirements.txt

backend/$(BACKEND_PYTHON):
	cd backend && $(PYTHON) -m venv .venv

setup-frontend:
	cd frontend && $(NPM) ci

# Give each server its own process group, then keep the polling loop in the foreground group.
dev:
	@set -m; \
	cleanup() { \
		kill -TERM -- -$$backend_pid -$$frontend_pid 2>/dev/null || true; \
		wait "$$backend_pid" "$$frontend_pid" 2>/dev/null || true; \
	}; \
	trap cleanup EXIT; \
	trap 'exit 130' INT; \
	trap 'exit 143' TERM; \
	( $(BACKEND_COMMAND) ) </dev/null & backend_pid=$$!; \
	( $(FRONTEND_COMMAND) ) </dev/null & frontend_pid=$$!; \
	set +m; \
	while kill -0 "$$backend_pid" "$$frontend_pid" 2>/dev/null; do sleep 1; done; \
	for pid in "$$backend_pid" "$$frontend_pid"; do \
		if ! kill -0 "$$pid" 2>/dev/null; then \
			wait "$$pid" || exit $$?; \
		fi; \
	done

backend:
	$(BACKEND_COMMAND)

frontend:
	$(FRONTEND_COMMAND)

health:
	@curl --fail --silent --show-error http://127.0.0.1:8000/health
	@printf '\n'

lint:
	cd frontend && $(NPM) run lint

build:
	cd frontend && $(NPM) run build
