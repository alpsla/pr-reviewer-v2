#!/bin/bash

# Simple script to regenerate favicon files from SVG if needed in the future
# Requires ImageMagick to be installed (convert command)

SVG_FILE="favicon-option3-fixed.svg"
echo "Generating favicons from $SVG_FILE..."

convert -background none $SVG_FILE -resize 16x16 favicon-16x16.png
convert -background none $SVG_FILE -resize 32x32 favicon-32x32.png
convert -background none $SVG_FILE -resize 180x180 apple-touch-icon.png
convert -background none $SVG_FILE -resize 192x192 android-chrome-192x192.png
convert -background none $SVG_FILE -resize 512x512 android-chrome-512x512.png
convert -background none $SVG_FILE -define icon:auto-resize=16,24,32,48,64 favicon.ico

echo "✅ Favicon files regenerated successfully!"
