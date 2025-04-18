#!/bin/bash

# Ensure jq is installed
if ! command -v jq &>/dev/null; then
  echo "❌ 'jq' is not installed. Please run: sudo apt install jq"
  exit 1
fi

INPUT="promo.json"
OUTPUT="promo_fixed.json"
BACKUP="promo_backup.json"

cp "$INPUT" "$BACKUP"

# Safely normalize "effects" → "effect"
jq '
  map(
    .abilities |= (
      if type == "array" then
        map(if has("effects") then .effect = .effects | del(.effects) else . end)
      else . end
    )
    |
    .attacks |= (
      if type == "array" then
        map(if has("effects") then .effect = .effects | del(.effects) else . end)
      else . end
    )
  )
' "$INPUT" > "$OUTPUT"

echo "✅ Cleaned version saved as $OUTPUT"
echo "🛡️  Original promo backed up as $BACKUP"

