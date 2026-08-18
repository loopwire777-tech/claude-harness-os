#!/bin/bash
# PreToolUse hook for Bash: hard-blocks destructive Prisma reset commands.
# Enforces .claude/rules/guardrails/database.md:
#   "Never run destructive database commands without explicit confirmation."
command=$(cat | jq -r '.tool_input.command // empty')

if echo "$command" | grep -Eq 'migrate[[:space:]]+reset|db:reset'; then
  echo "BLOCKED: '$command' looks like a destructive database reset (prisma migrate reset / npm run db:reset)." >&2
  echo "This is a hard block enforcing .claude/rules/guardrails/database.md:" >&2
  echo '  "Never run destructive database commands without explicit confirmation."' >&2
  echo "If you really need to reset the local dev database, ask the human to run it manually." >&2
  exit 2
fi

exit 0
