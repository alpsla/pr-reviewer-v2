#!/bin/bash

echo "CodeQual Final Favicon Cleanup"
echo "============================"
echo ""

# Create a final backup
echo "Creating final backup of favicon files..."
mkdir -p final-favicon-backup-$(date +"%Y%m%d")
cp favicon*.* final-favicon-backup-$(date +"%Y%m%d")/ 2>/dev/null || true
cp apple-touch-icon.png final-favicon-backup-$(date +"%Y%m%d")/ 2>/dev/null || true
cp android-chrome-*.png final-favicon-backup-$(date +"%Y%m%d")/ 2>/dev/null || true

# Remove all old favicon files and scripts, except the ones we need
echo "Removing old favicon files and scripts..."
rm -f favicon-simplified.svg
rm -f favicon-option2.svg
rm -f favicon-option3.svg
rm -f favicon-option3-improved.svg
rm -f favicon-test.html
rm -f static-favicon.html
rm -f test-favicon.svg
rm -f generate-favicons.sh
rm -f generate-simplified-favicons.sh
rm -f update-favicon.sh
rm -f update-improved-favicon.sh
rm -f run-favicon-update.sh
rm -f make_favicon_script_executable.sh
rm -f cleanup-old-favicons.sh
rm -f FAVICON-README.md
rm -f FAVICON-TROUBLESHOOTING.md

# Remove backup directories except the most recent
echo "Cleaning up old backup directories..."
rm -rf favicon-backup 2>/dev/null || true
rm -rf favicons-temp 2>/dev/null || true
rm -rf full-favicon-backup 2>/dev/null || true

# Keep a simplified update script for future reference
cat > update-favicon.sh << 'EOL'
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
EOL

chmod +x update-favicon.sh

echo ""
echo "✅ Cleanup completed!"
echo ""
echo "Kept files:"
echo "- favicon.ico - Main favicon file"
echo "- favicon-16x16.png - Small favicon for browsers"
echo "- favicon-32x32.png - Standard favicon for browsers" 
echo "- apple-touch-icon.png - For iOS devices"
echo "- android-chrome-192x192.png - For Android devices"
echo "- android-chrome-512x512.png - For Android devices"
echo "- favicon-option3-fixed.svg - Source SVG with visible checkmark"
echo "- update-favicon.sh - Simple script for future favicon regeneration"
echo ""
echo "All removed files are backed up in: final-favicon-backup-$(date +"%Y%m%d")"
echo ""
echo "The favicon setup is now clean and complete!"
