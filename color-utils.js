/**
 * Color utilities for enhanced typography and visual elements
 */
class ColorUtils {
  constructor() {
    this.updateColorVars();
    this.applyContrastChecks();
    
    // Update colors when dark mode changes
    document.addEventListener('darkModeChange', () => {
      this.updateColorVars();
      this.applyContrastChecks();
    });
  }
  
  // Update CSS variables with optimized colors
  updateColorVars() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Apply high-contrast text for better readability in both modes
    document.documentElement.style.setProperty(
      '--filter-label-color', 
      isDarkMode ? '#4cc9f0' : '#3a0ca3'
    );
    
    // Enhance stat values with more vivid gradients
    document.documentElement.style.setProperty(
      '--stat-value-gradient', 
      isDarkMode ? 
        'linear-gradient(135deg, #4cc9f0, #f72585)' : 
        'linear-gradient(135deg, #4361ee, #7209b7)'
    );
  }
  
  // Check and improve text contrast
  applyContrastChecks() {
    // Target elements that might need contrast improvement
    const textElements = document.querySelectorAll('.text-secondary, .stat-label, .filter-label');
    
    textElements.forEach(el => {
      // Get computed style
      const style = window.getComputedStyle(el);
      const color = style.color;
      const bgColor = this.getBackgroundColor(el);
      
      // If contrast is poor, enhance it
      if (!this.hasGoodContrast(color, bgColor)) {
        const enhancedColor = this.getEnhancedColor(color, bgColor);
        el.style.color = enhancedColor;
      }
    });
  }
  
  // Get element's background color considering parent elements
  getBackgroundColor(el) {
    let currentEl = el;
    let bgColor = 'transparent';
    
    while (currentEl && bgColor === 'transparent') {
      const style = window.getComputedStyle(currentEl);
      bgColor = style.backgroundColor;
      currentEl = currentEl.parentElement;
    }
    
    return bgColor === 'transparent' ? '#ffffff' : bgColor;
  }
  
  // Simple contrast check (for illustration)
  hasGoodContrast(color, bgColor) {
    // This is a simplified version; a real implementation 
    // would convert colors to luminance values and calculate contrast ratio
    return true;
  }
  
  // Get an enhanced color with better contrast
  getEnhancedColor(color, bgColor) {
    // This would normally involve adjusting the color to meet WCAG standards
    return color;
  }
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new ColorUtils();
});