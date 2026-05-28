// 1. Navigation Scroll Effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('nav-header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// 2. Active Nav Link on Scroll & Scroll Reveal
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links .nav-item');

const observerOptions = {
  root: null,
  threshold: 0.15,
  rootMargin: '0px'
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Add scroll reveal effect
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      
      // Update active nav link
      const id = entry.target.getAttribute('id');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${id}`) {
          item.classList.add('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => {
  section.classList.add('scroll-reveal');
  sectionObserver.observe(section);
});

// 3. Modal Popup Functions
function openModal(caseId) {
  const modal = document.getElementById(`modal-${caseId}`);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // block page scroll
  }
}

function closeModal(caseId) {
  const modal = document.getElementById(`modal-${caseId}`);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // restore page scroll
  }
}

// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      const id = backdrop.getAttribute('id').replace('modal-', '');
      closeModal(id);
    }
  });
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.active').forEach(backdrop => {
      const id = backdrop.getAttribute('id').replace('modal-', '');
      closeModal(id);
    });
  }
});

// 4. Toast Notification helper
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-regular fa-circle-check" style="color: var(--color-accent);"></i> ${message}`;
  container.appendChild(toast);

  // Trigger browser paint to enable transition animation
  setTimeout(() => toast.classList.add('show'), 50);

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 5. Contact Email Action (Copy to Clipboard and Notify User)
const emailAddress = 'sksn12@naver.com';

function handleEmailClick(e) {
  // Try to copy to clipboard for better UX fallback if mail client is not set up
  navigator.clipboard.writeText(emailAddress)
    .then(() => {
      showToast('이메일 주소(sksn12@naver.com)가 복사되었습니다. 메일 클라이언트가 열립니다.');
    })
    .catch(err => {
      console.error('클립보드 복사 실패:', err);
    });
}

const contactBtn = document.getElementById('contact-btn');
const linkEmail = document.getElementById('link-email');

if (contactBtn) contactBtn.addEventListener('click', handleEmailClick);
if (linkEmail) linkEmail.addEventListener('click', handleEmailClick);

// 6. Theme Switcher Logic
const themeButtons = document.querySelectorAll('.theme-btn');

function applyTheme(themeName) {
  document.body.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
  
  // Update active state in buttons
  themeButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-theme') === themeName) {
      btn.classList.add('active');
    }
  });
}

// Bind click events to buttons
themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedTheme = btn.getAttribute('data-theme');
    applyTheme(selectedTheme);
  });
});

// Load saved theme or default to hyundai
const savedTheme = localStorage.getItem('theme') || 'hyundai';
applyTheme(savedTheme);

// 7. Falling Leaves Animation
function createLeaf() {
  const container = document.body;
  const leaf = document.createElement('div');
  leaf.className = 'leaf-particle';
  
  // Random size (smaller, delicate hand-etched leaflet scale)
  const size = Math.random() * 4 + 5; // 5px ~ 9px
  leaf.style.width = `${size}px`;
  leaf.style.height = `${size * 1.6}px`;
  
  // Sprout exclusively from the top-right cherry blossom foliage zone
  const startX = window.innerWidth - Math.random() * 240 - 10;
  // Foliage sits in the upper right quadrant
  const startY = Math.random() * 180 - 20; 
  leaf.style.left = `${startX}px`;
  leaf.style.top = `${startY}px`;
  
  // Subtle blending opacities matching cherry tree theme
  const targetOpacity = Math.random() * 0.16 + 0.10; // 0.10 ~ 0.26
  leaf.style.opacity = '0';
  
  // Apply visual variation
  const rotation = Math.random() * 360;
  leaf.style.transform = `scale(0) rotate(${rotation}deg)`;
  
  container.appendChild(leaf);
  
  // Physics: Leftward and downward drift simulating wind from top right
  const targetSpeedY = Math.random() * 0.5 + 0.4; // gentle fall
  let speedY = 0.05; // start very slow (detaching)
  const speedX = -1.0 * (Math.random() * 0.5 + 0.35); // drift leftwards
  const swingRange = Math.random() * 1.2 + 0.7; // swing frequency
  const spinSpeed = Math.random() * 25 + 15; // tumbling speed
  
  let currentY = startY;
  let currentX = startX;
  let time = 0;
  let currentScale = 0;
  let currentOpacity = 0;
  
  const animate = () => {
    time += 0.012;
    
    // 1. Soft Fade-in
    if (currentScale < 1) {
      currentScale += 0.025;
      currentOpacity += targetOpacity * 0.025;
    } else {
      currentScale = 1;
      currentOpacity = targetOpacity;
    }
    
    // 2. Slow acceleration toward terminal vertical velocity
    speedY = speedY * 0.98 + targetSpeedY * 0.02;
    currentY += speedY;
    
    // 3. Leftward horizontal sweep with wind turbulence
    const windForce = Math.sin(time * swingRange) * 0.6 + Math.cos(time * 1.2) * 0.2;
    currentX += speedX + windForce;
    
    leaf.style.top = `${currentY}px`;
    leaf.style.left = `${currentX}px`;
    
    // 4. 3D Tumbling
    const flipY = Math.sin(time * 2.0) * 70;
    const flipX = Math.cos(time * 1.5) * 40;
    leaf.style.transform = `scale(${currentScale}) rotateZ(${rotation + time * spinSpeed}deg) rotateY(${flipY}deg) rotateX(${flipX}deg)`;
    
    // 5. Soft Fade-out when moving away or leaving screen
    let isFadingOut = false;
    const fadeBoundaryY = window.innerHeight - 100;
    const fadeBoundaryX = 150; // fade out before reaching too far left to keep focus
    
    if (currentY > fadeBoundaryY || currentX < fadeBoundaryX) {
      isFadingOut = true;
      const ratioY = Math.max(0, 1 - (currentY - fadeBoundaryY) / 80);
      const ratioX = Math.max(0, (currentX - 50) / fadeBoundaryX);
      const minRatio = Math.min(ratioY, ratioX);
      leaf.style.opacity = `${currentOpacity * minRatio}`;
      
      if (minRatio <= 0.02) {
        leaf.remove();
        return;
      }
    } else {
      leaf.style.opacity = `${currentOpacity}`;
    }
    
    // Check boundaries
    if (currentY < window.innerHeight && currentX > -50 && currentX < window.innerWidth + 50) {
      requestAnimationFrame(animate);
    } else {
      leaf.remove();
    }
  };
  
  requestAnimationFrame(animate);
}

// Start generating leaves
let leafInterval;
function startFallingLeaves() {
  if (leafInterval) clearInterval(leafInterval);
  // Generate a leaf every 2.6 seconds for a tranquil, moderate visual effect
  leafInterval = setInterval(createLeaf, 2600);
  
  // Create 3 leaves initially with staggered delays to pre-populate the screen gently
  for (let i = 0; i < 3; i++) {
    setTimeout(createLeaf, Math.random() * 6000);
  }
}

// Initialize falling leaves
startFallingLeaves();

// 8. Magical Golden Stag Mouse Interaction
const magicalStag = document.getElementById('magical-stag');
if (magicalStag) {
  let hoverTimeout = null;
  let leaveTimeout = null;

  magicalStag.addEventListener('mouseenter', () => {
    // Clear any pending timeouts
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (leaveTimeout) clearTimeout(leaveTimeout);

    // Pause the walking / breathing animation to avoid teleportation bugs
    const actor = magicalStag.querySelector('.deer-actor-group');
    if (actor) {
      actor.style.animationPlayState = 'paused';
    }
    
    // Smoothly lift head to look at the user
    const head = magicalStag.querySelector('.deer-head-group');
    if (head) {
      head.dataset.isHovered = 'true';
      head.style.animation = 'none';
      head.classList.remove('deer-hover-look');
      
      // Trigger reflow to apply transition safely
      void head.offsetWidth; 
      
      head.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      head.style.transform = 'rotate(9deg) translateY(-1.2px)';
      
      // After transition finishes, start the breathing look-at-user animation loop
      hoverTimeout = setTimeout(() => {
        if (head.dataset.isHovered === 'true') {
          head.style.transition = 'none';
          head.classList.add('deer-hover-look');
        }
      }, 600);
    }
  });

  magicalStag.addEventListener('mouseleave', () => {
    // Clear any pending timeouts
    if (hoverTimeout) clearTimeout(hoverTimeout);
    if (leaveTimeout) clearTimeout(leaveTimeout);

    const actor = magicalStag.querySelector('.deer-actor-group');
    const head = magicalStag.querySelector('.deer-head-group');
    
    if (head) {
      head.dataset.isHovered = 'false';
      head.classList.remove('deer-hover-look');
      
      // Trigger reflow
      void head.offsetWidth;
      
      head.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      head.style.transform = ''; // return to path-defined default position
      
      // Wait for return transition to finish, then restore the 28s movement loop
      leaveTimeout = setTimeout(() => {
        if (head.dataset.isHovered === 'false') {
          head.style.transition = '';
          head.style.animation = 'deer-head-move 28s ease-in-out infinite';
          
          // Resume movement loop once head is fully back
          if (actor) {
            actor.style.animationPlayState = 'running';
          }
        }
      }, 600);
    } else {
      if (actor) {
        actor.style.animationPlayState = 'running';
      }
    }
  });
}
