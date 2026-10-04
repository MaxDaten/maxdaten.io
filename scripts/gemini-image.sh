#!/usr/bin/env bash
# Generate an image with Gemini (Interactions API) and write it to a file.
# Usage: gemini-image [-m model] [-a aspect] [-s size] -o out.jpg "prompt" [reference-image ...]
# Run through the `gemini-image` devenv script, which injects GOOGLE_GEMINI_API_KEY via secretspec.
set -euo pipefail

model="${GEMINI_IMAGE_MODEL:-gemini-3.1-flash-image}"
aspect=""
size=""
out=""

usage() {
    sed -n '3p' "$0" | sed 's/^# //' >&2
    echo "  -m model   default gemini-3.1-flash-image; gemini-3-pro-image for harder compositions" >&2
    echo "  -a aspect  1:1 3:2 2:3 3:4 4:3 4:5 5:4 9:16 16:9 21:9" >&2
    echo "  -s size    512 1K 2K 4K" >&2
    exit 2
}

while getopts "m:a:s:o:h" opt; do
    case "$opt" in
        m) model="$OPTARG" ;;
        a) aspect="$OPTARG" ;;
        s) size="$OPTARG" ;;
        o) out="$OPTARG" ;;
        *) usage ;;
    esac
done
shift $((OPTIND - 1))
[ -n "$out" ] && [ $# -ge 1 ] || usage
prompt="$1"
shift

key="${GOOGLE_GEMINI_API_KEY:-${GEMINI_API_KEY:-}}"
[ -n "$key" ] || {
    echo "gemini-image: GOOGLE_GEMINI_API_KEY is not set (secretspec check)" >&2
    exit 1
}

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

jq -n --arg t "$prompt" '[{type: "text", text: $t}]' >"$tmp/input.json"
for ref in "$@"; do
    case "${ref,,}" in
        *.png) mime=image/png ;;
        *.jpg | *.jpeg) mime=image/jpeg ;;
        *.webp) mime=image/webp ;;
        *)
            echo "gemini-image: unsupported reference image $ref" >&2
            exit 2
            ;;
    esac
    base64 <"$ref" | tr -d '\n' >"$tmp/ref.b64"
    jq --rawfile d "$tmp/ref.b64" --arg m "$mime" \
        '. + [{type: "image", mime_type: $m, data: $d}]' "$tmp/input.json" >"$tmp/next.json"
    mv "$tmp/next.json" "$tmp/input.json"
done

jq -n --arg model "$model" --arg aspect "$aspect" --arg size "$size" \
    --slurpfile input "$tmp/input.json" '{
        model: $model,
        input: $input[0],
        response_format: (
            {type: "image"}
            + (if $aspect != "" then {aspect_ratio: $aspect} else {} end)
            + (if $size != "" then {image_size: $size} else {} end)
        )
    }' >"$tmp/request.json"

status=$(curl -sS -o "$tmp/response.json" -w '%{http_code}' -X POST \
    "https://generativelanguage.googleapis.com/v1beta/interactions" \
    -H "x-goog-api-key: $key" \
    -H 'Content-Type: application/json' \
    --data-binary @"$tmp/request.json")

if [ "$status" != 200 ]; then
    echo "gemini-image: HTTP $status" >&2
    jq -r '.error.message // .' "$tmp/response.json" >&2
    exit 1
fi

jq -r '[.steps[] | select(.type == "model_output") | .content[] | select(.type == "image")]
    | last | .data // empty' "$tmp/response.json" >"$tmp/image.b64"
if [ ! -s "$tmp/image.b64" ]; then
    echo "gemini-image: no image in response" >&2
    jq -r '[.steps[]? | .content[]? | select(.type == "text") | .text] | join("\n")' "$tmp/response.json" >&2
    exit 1
fi

mkdir -p "$(dirname "$out")"
base64 -d <"$tmp/image.b64" >"$out"
echo "$out"
