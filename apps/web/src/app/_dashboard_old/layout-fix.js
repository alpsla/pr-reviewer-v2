// JavaScript fixes for dashboard layout issues

export function fixDashboardLayout() {
  // Run after DOM is loaded
  const applyFixes = () => {
    // 1. Remove the empty top container
    const topContainer = document.querySelector('.container.flex.h-14.items-center');
    if (topContainer) {
      topContainer.remove();
    }

    // 2. Fix header width
    const header = document.querySelector('header');
    if (header) {
      header.style.width = '100vw';
      header.style.maxWidth = '100vw';
      
      // Fix header inner container
      const headerDiv = header.querySelector('div');
      if (headerDiv) {
        headerDiv.style.width = '100vw';
        headerDiv.style.maxWidth = '100vw';
        headerDiv.style.paddingLeft = '1.5rem';
        headerDiv.style.paddingRight = '1.5rem';
      }
    }

    // 3. Fix footer width and content
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.width = '100vw';
      footer.style.maxWidth = '100vw';
      
      // Fix footer container
      const footerContainer = footer.querySelector('div');
      if (footerContainer) {
        footerContainer.style.width = '100vw';
        footerContainer.style.maxWidth = '100vw';
        footerContainer.style.paddingLeft = '1.5rem';
        footerContainer.style.paddingRight = '1.5rem';
      }
      
      // Fix footer grid
      const grid = footer.querySelector('.grid');
      if (grid) {
        grid.style.width = '100%';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
        grid.style.gap = '1.5rem';
        
        // Fix grid columns
        const columns = grid.querySelectorAll('div');
        columns.forEach(column => {
          column.style.minWidth = '120px';
          
          // Fix headings
          const heading = column.querySelector('h3');
          if (heading) {
            heading.style.display = 'block';
            heading.style.width = '100%';
          }
          
          // Fix links
          const links = column.querySelectorAll('a');
          links.forEach(link => {
            link.style.display = 'block';
            link.style.width = '100%';
          });
        });
      }
      
      // Fix copyright section
      const copyright = footer.querySelector('.mt-16');
      if (copyright) {
        copyright.style.width = '100%';
        copyright.style.textAlign = 'center';
      }
    }
  };

  // Run immediately if document is ready
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    applyFixes();
  } else {
    document.addEventListener('DOMContentLoaded', applyFixes);
  }
  
  // Also run after a delay to ensure everything is loaded
  setTimeout(applyFixes, 200);
  
  // Run again after a longer delay as a fallback
  setTimeout(applyFixes, 1000);
}
