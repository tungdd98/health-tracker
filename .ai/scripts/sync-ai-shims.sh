#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-sync}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
AI_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPO_ROOT="$(cd "${AI_DIR}/.." && pwd)"

BASE_DOC="${AI_DIR}/instructions/base.md"
CLAUDE_DOC="${REPO_ROOT}/CLAUDE.md"
AGENTS_DOC="${REPO_ROOT}/AGENTS.md"

ensure_dir() {
  mkdir -p "$1"
}

ensure_link() {
  local path="$1"
  local target="$2"

  if [ -L "$path" ]; then
    local actual
    actual="$(readlink "$path")"
    if [ "$actual" = "$target" ]; then
      return 0
    fi
    rm "$path"
  elif [ -e "$path" ]; then
    echo "ERROR: $path exists and is not a symlink" >&2
    exit 1
  fi

  ln -s "$target" "$path"
}

check_link() {
  local path="$1"
  local target="$2"

  if [ ! -L "$path" ]; then
    echo "ERROR: $path is not a symlink" >&2
    return 1
  fi

  local actual
  actual="$(readlink "$path")"
  if [ "$actual" != "$target" ]; then
    echo "ERROR: $path points to $actual (expected $target)" >&2
    return 1
  fi
}

render_doc() {
  local platform="$1"
  local output="$2"
  local note="$3"

  cat <<EOF
# ${platform}

> Generated from \`.ai/instructions/base.md\` by \`.ai/scripts/sync-ai-shims.sh\`.
> Edit the shared instructions in \`.ai/instructions/base.md\`, not this file.

${note}

EOF
  cat "$BASE_DOC"
}

sync_doc() {
  local platform="$1"
  local output="$2"
  local note="$3"
  local tmp

  tmp="$(mktemp)"
  render_doc "$platform" "$output" "$note" > "$tmp"
  if [ ! -f "$output" ] || ! cmp -s "$tmp" "$output"; then
    mv "$tmp" "$output"
  else
    rm "$tmp"
  fi
}

check_doc() {
  local platform="$1"
  local output="$2"
  local note="$3"
  local tmp

  tmp="$(mktemp)"
  render_doc "$platform" "$output" "$note" > "$tmp"
  if [ ! -f "$output" ]; then
    echo "ERROR: $output is missing" >&2
    rm "$tmp"
    return 1
  fi
  if ! cmp -s "$tmp" "$output"; then
    echo "ERROR: $output is out of date" >&2
    rm "$tmp"
    return 1
  fi
  rm "$tmp"
}

CLAUDE_NOTE="Claude-specific config stays under \`.claude/\` (for example \`.claude/settings.json\` and \`.claude/hooks/\`)."
AGENTS_NOTE="Codex-specific config stays under \`.agents/\`. Shared skills and agent prompts still resolve through the symlinks in that folder."

case "$MODE" in
  sync)
    ensure_dir "${REPO_ROOT}/.claude"
    ensure_dir "${REPO_ROOT}/.agents"
    ensure_link "${REPO_ROOT}/.claude/skills" "../.ai/skills"
    ensure_link "${REPO_ROOT}/.claude/agents" "../.ai/agents"
    ensure_link "${REPO_ROOT}/.agents/skills" "../.ai/skills"
    ensure_link "${REPO_ROOT}/.agents/agents" "../.ai/agents"
    sync_doc "CLAUDE.md" "$CLAUDE_DOC" "$CLAUDE_NOTE"
    sync_doc "AGENTS.md" "$AGENTS_DOC" "$AGENTS_NOTE"
    ;;
  --check)
    check_link "${REPO_ROOT}/.claude/skills" "../.ai/skills"
    check_link "${REPO_ROOT}/.claude/agents" "../.ai/agents"
    check_link "${REPO_ROOT}/.agents/skills" "../.ai/skills"
    check_link "${REPO_ROOT}/.agents/agents" "../.ai/agents"
    check_doc "CLAUDE.md" "$CLAUDE_DOC" "$CLAUDE_NOTE"
    check_doc "AGENTS.md" "$AGENTS_DOC" "$AGENTS_NOTE"
    ;;
  *)
    echo "Usage: $0 [sync|--check]" >&2
    exit 1
    ;;
esac
