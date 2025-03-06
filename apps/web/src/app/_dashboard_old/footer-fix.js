// This script fixes the footer layout 
// It's included in the dashboard page to ensure proper rendering

export function fixFooterLayout() {
  // This function needs to run after the footer is rendered
  setTimeout(() => {
    // Fix the top container with sign-out button that keeps reappearing
    const topContainers = document.querySelectorAll('.flex.flex-1.items-center.justify-between.space-x-2');
    topContainers.forEach(container => {
      container.style.display = 'none';
    });
    
    // Also target by a simpler selector if the above doesn't catch it
    const flexContainers = document.querySelectorAll('div.flex.flex-1.items-center.justify-between');
    flexContainers.forEach(container => {
      container.style.display = 'none';
    });
    
    // Fix any nav containers with only a sign-out button
    const navContainers = document.querySelectorAll('nav.flex.items-center.space-x-2');
    navContainers.forEach(nav => {
      // Check if this nav only contains a sign-out button and no links
      const buttons = nav.querySelectorAll('button');
      const links = nav.querySelectorAll('a');
      if (buttons.length > 0 && links.length === 0) {
        nav.style.display = 'none';
      }
    });
    
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    // Fix the footer width and margins
    footer.style.width = '100%';
    footer.style.maxWidth = '100%';
    
    // Fix the container inside the footer
    const container = footer.querySelector('.container') || footer.querySelector('div:first-child');
    if (container) {
      container.style.width = '100%';
      container.style.maxWidth = '100%';
      container.style.paddingLeft = '2rem';
      container.style.paddingRight = '2rem';
      
      // Fix the grid inside the container
      const grid = container.querySelector('.grid');
      if (grid) {
        grid.style.width = '100%';
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        
        // Fix individual grid items
        const columns = grid.querySelectorAll('div');
        columns.forEach((col) => {
          col.style.minWidth = '150px';
          
          // Fix headings
          const heading = col.querySelector('h3');
          if (heading) {
            heading.style.display = 'block';
            heading.style.width = '100%';
          }
          
          // Fix links
          const links = col.querySelectorAll('a');
          links.forEach((link) => {
            link.style.display = 'block';
            link.style.whiteSpace = 'nowrap';
          });
        });
      }
      
      // Fix copyright section
      const copyright = container.querySelector('.mt-16');
      if (copyright) {
        copyright.style.width = '100%';
        copyright.style.display = 'block';
        copyright.style.textAlign = 'center';
      }
    }
  }, 100);
}
