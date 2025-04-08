// Collection of loading animation components
class LoadingAnimator {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = {
      type: options.type || 'pulse',
      color: options.color || '#4a90e2',
      size: options.size || 'medium',
      message: options.message || 'Loading data...',
      showMessage: options.showMessage !== undefined ? options.showMessage : true
    };
    this.animations = {
      pulse: this.createPulseAnimation,
      dots: this.createDotsAnimation,
      spinner: this.createSpinnerAnimation,
      blocks: this.createBlocksAnimation,
      wave: this.createWaveAnimation
    };
  }

  get sizeValue() {
    const sizes = {
      small: { container: '60px', element: '10px', fontSize: '12px' },
      medium: { container: '100px', element: '15px', fontSize: '14px' },
      large: { container: '150px', element: '20px', fontSize: '16px' }
    };
    return sizes[this.options.size] || sizes.medium;
  }

  show() {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.justifyContent = 'center';
    this.container.style.alignItems = 'center';
    this.container.style.padding = '20px';
    
    const animationFn = this.animations[this.options.type] || this.animations.pulse;
    animationFn.call(this);
    
    if (this.options.showMessage) {
      const message = document.createElement('div');
      message.textContent = this.options.message;
      message.style.marginTop = '15px';
      message.style.color = this.options.color;
      message.style.fontSize = this.sizeValue.fontSize;
      message.style.fontWeight = '500';
      this.container.appendChild(message);
    }
  }

  hide() {
    if (this.container) {
      this.container.style.display = 'none';
      this.container.innerHTML = '';
    }
  }

  createPulseAnimation() {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    
    for (let i = 0; i < 3; i++) {
      const circle = document.createElement('div');
      circle.style.width = this.sizeValue.element;
      circle.style.height = this.sizeValue.element;
      circle.style.borderRadius = '50%';
      circle.style.backgroundColor = this.options.color;
      circle.style.margin = '0 5px';
      circle.style.animation = `pulse 1.5s infinite ease-in-out`;
      circle.style.animationDelay = `${i * 0.2}s`;
      wrapper.appendChild(circle);
    }
    
    // Add keyframes
    if (!document.getElementById('loading-keyframes')) {
      const style = document.createElement('style');
      style.id = 'loading-keyframes';
      style.textContent = `
        @keyframes pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.6; }
          40% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.container.appendChild(wrapper);
  }

  createDotsAnimation() {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.justifyContent = 'center';
    wrapper.style.alignItems = 'center';
    wrapper.style.position = 'relative';
    wrapper.style.width = this.sizeValue.container;
    wrapper.style.height = this.sizeValue.container;
    
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('div');
      const angle = (i * 45) * (Math.PI / 180);
      const radius = parseInt(this.sizeValue.container) / 2.5;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      dot.style.position = 'absolute';
      dot.style.width = this.sizeValue.element;
      dot.style.height = this.sizeValue.element;
      dot.style.borderRadius = '50%';
      dot.style.backgroundColor = this.options.color;
      dot.style.top = `calc(50% - ${parseInt(this.sizeValue.element)/2}px + ${y}px)`;
      dot.style.left = `calc(50% - ${parseInt(this.sizeValue.element)/2}px + ${x}px)`;
      dot.style.animation = `dotsScale 1.2s infinite ease-in-out`;
      dot.style.animationDelay = `${i * 0.15}s`;
      dot.style.opacity = '0';
      wrapper.appendChild(dot);
    }
    
    // Add keyframes
    if (!document.getElementById('dots-keyframes')) {
      const style = document.createElement('style');
      style.id = 'dots-keyframes';
      style.textContent = `
        @keyframes dotsScale {
          0%, 80%, 100% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.container.appendChild(wrapper);
  }

  createSpinnerAnimation() {
    const spinner = document.createElement('div');
    spinner.style.width = this.sizeValue.container;
    spinner.style.height = this.sizeValue.container;
    spinner.style.border = `4px solid rgba(${this.hexToRgb(this.options.color)}, 0.2)`;
    spinner.style.borderTopColor = this.options.color;
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s infinite linear';
    
    // Add keyframes
    if (!document.getElementById('spinner-keyframes')) {
      const style = document.createElement('style');
      style.id = 'spinner-keyframes';
      style.textContent = `
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.container.appendChild(spinner);
  }

  createBlocksAnimation() {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gridTemplateColumns = 'repeat(3, 1fr)';
    wrapper.style.gridGap = '5px';
    wrapper.style.width = this.sizeValue.container;
    wrapper.style.height = this.sizeValue.container;
    
    for (let i = 0; i < 9; i++) {
      const block = document.createElement('div');
      block.style.width = '100%';
      block.style.height = '100%';
      block.style.backgroundColor = this.options.color;
      block.style.animation = 'blockFade 1.5s infinite ease-in-out';
      block.style.animationDelay = `${i * 0.1}s`;
      block.style.opacity = '0.1';
      wrapper.appendChild(block);
    }
    
    // Add keyframes
    if (!document.getElementById('blocks-keyframes')) {
      const style = document.createElement('style');
      style.id = 'blocks-keyframes';
      style.textContent = `
        @keyframes blockFade {
          0%, 70%, 100% { opacity: 0.1; transform: scale(0.8); }
          35% { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.container.appendChild(wrapper);
  }

  createWaveAnimation() {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.height = this.sizeValue.container;
    
    for (let i = 0; i < 5; i++) {
      const bar = document.createElement('div');
      bar.style.width = parseInt(this.sizeValue.element) / 1.5 + 'px';
      bar.style.height = parseInt(this.sizeValue.element) + 'px';
      bar.style.margin = '0 3px';
      bar.style.backgroundColor = this.options.color;
      bar.style.animation = 'waveStretch 1.2s infinite ease-in-out';
      bar.style.animationDelay = `${i * 0.1}s`;
      wrapper.appendChild(bar);
    }
    
    // Add keyframes
    if (!document.getElementById('wave-keyframes')) {
      const style = document.createElement('style');
      style.id = 'wave-keyframes';
      style.textContent = `
        @keyframes waveStretch {
          0%, 40%, 100% { transform: scaleY(0.4); }
          20% { transform: scaleY(1); }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.container.appendChild(wrapper);
  }

  hexToRgb(hex) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
  }
}