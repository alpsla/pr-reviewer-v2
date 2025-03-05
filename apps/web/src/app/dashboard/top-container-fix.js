// This script is specifically designed to target and hide the problematic top container

export function fixTopContainer() {
  // Function to hide the top container
  const hideTopContainer = () => {
    // Target by exact class name
    const exactMatch = document.querySelector('.flex.flex-1.items-center.justify-between.space-x-2.md\\:justify-end');
    if (exactMatch) {
      exactMatch.style.display = 'none';
      return true;
    }
    
    // Target by partial class match
    const partialMatches = document.querySelectorAll('[class*="flex-1"][class*="items-center"][class*="justify-between"]');
    let found = false;
    partialMatches.forEach(element => {
      // Check if it's a sign-out button container
      const signOutButton = element.querySelector('button:has(svg)');
      if (signOutButton && signOutButton.textContent.includes('Sign Out')) {
        element.style.display = 'none';
        found = true;
      }
    });
    
    // Look for any nav with just a sign-out button
    const navs = document.querySelectorAll('nav.flex.items-center');
    navs.forEach(nav => {
      const buttons = nav.querySelectorAll('button');
      if (buttons.length === 1 && buttons[0].textContent.includes('Sign Out')) {
        // Check if this nav is not in the header
        const isInHeader = !!nav.closest('header');
        if (!isInHeader) {
          nav.style.display = 'none';
          found = true;
        }
      }
    });
    
    return found;
  };
  
  // Run immediately
  let success = hideTopContainer();
  
  // Set up a retry mechanism
  if (!success) {
    // Try a few times with increasing delays
    [50, 100, 300, 500, 1000].forEach(delay => {
      setTimeout(hideTopContainer, delay);
    });
    
    // Also set up a mutation observer to catch dynamically added elements
    const observer = new MutationObserver((mutations) => {
      // Check if any of the mutations might have added our target
      const shouldCheck = mutations.some(mutation => 
        mutation.type === 'childList' && 
        mutation.addedNodes.length > 0
      );
      
      if (shouldCheck) {
        hideTopContainer();
      }
    });
    
    // Start observing the document body
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
    
    // Stop after 10 seconds to avoid memory leaks
    setTimeout(() => observer.disconnect(), 10000);
  }
}
