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

// 4. Copy Prompt Code Clipboard
function copyPromptText() {
  const promptCode = document.getElementById('prompt-code').innerText;
  const copyBtn = document.getElementById('copy-btn');
  
  navigator.clipboard.writeText(promptCode).then(() => {
    // Visual feedback
    const originalContent = copyBtn.innerHTML;
    copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #00f0ff;"></i> Copied!';
    copyBtn.style.borderColor = '#00f0ff';
    copyBtn.style.color = '#00f0ff';
    
    setTimeout(() => {
      copyBtn.innerHTML = originalContent;
      copyBtn.style.borderColor = '';
      copyBtn.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('클립보드 복사 실패:', err);
  });
}
