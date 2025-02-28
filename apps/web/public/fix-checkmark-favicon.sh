#!/bin/bash

# Script to fix the favicon with a more visible checkmark

echo "CodeQual Favicon Checkmark Fix"
echo "============================"
echo ""

SVG_FILE="favicon-option3-fixed.svg"
echo "Using fixed version with enhanced checkmark visibility"

# Check if ImageMagick is installed
if command -v convert >/dev/null 2>&1; then
  echo "✅ Using ImageMagick to convert SVG to PNG/ICO"
  
  # Generate PNG files from SVG
  convert -background none $SVG_FILE -resize 16x16 favicon-16x16.png
  convert -background none $SVG_FILE -resize 32x32 favicon-32x32.png
  convert -background none $SVG_FILE -resize 180x180 apple-touch-icon.png
  convert -background none $SVG_FILE -resize 192x192 android-chrome-192x192.png
  convert -background none $SVG_FILE -resize 512x512 android-chrome-512x512.png
  
  # Generate ICO file with multiple sizes for better rendering
  convert -background none $SVG_FILE -define icon:auto-resize=16,24,32,48,64 favicon.ico
  
  echo "✅ All favicon files generated successfully!"
# Check if Inkscape is installed as a fallback
elif command -v inkscape >/dev/null 2>&1; then
  echo "✅ Using Inkscape to convert SVG to PNG"
  
  # Generate PNG files from SVG
  inkscape -w 16 -h 16 $SVG_FILE -o favicon-16x16.png
  inkscape -w 32 -h 32 $SVG_FILE -o favicon-32x32.png
  inkscape -w 180 -h 180 $SVG_FILE -o apple-touch-icon.png
  inkscape -w 192 -h 192 $SVG_FILE -o android-chrome-192x192.png
  inkscape -w 512 -h 512 $SVG_FILE -o android-chrome-512x512.png
  
  # Copy SVG file for browsers that support SVG favicons
  cp $SVG_FILE favicon.svg
  
  echo "✅ PNG favicon files generated successfully!"
  echo "⚠️ Note: favicon.ico not generated. Using existing file if available."
else
  echo "❌ Error: Image conversion tools not found."
  echo "⚠️ Manually copying SVG file to use as favicon..."
  
  # If neither ImageMagick nor Inkscape is available, just copy the SVG file
  cp $SVG_FILE favicon.svg
  
  echo "✅ Copied $SVG_FILE to favicon.svg"
  echo "⚠️ For best results, please install ImageMagick or Inkscape"
fi

# Update the SVG reference in the layout file
echo ""
echo "Updating the SVG reference in layout.tsx..."
cd ../src/app
sed -i '' 's/favicon-option3-improved.svg/favicon-option3-fixed.svg/g' layout.tsx

echo ""
echo "✅ Favicon updated with enhanced checkmark visibility!"
echo "The checkmark is now:"
echo "- Brighter green color (#00ff00)"
echo "- Thicker stroke width (14px)"
echo "- Repositioned for better visibility"
echo ""
echo "Please refresh your browser to see the changes."
echo "You may need to clear your browser cache or try a private/incognito window."
