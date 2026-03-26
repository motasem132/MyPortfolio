/* ========================================
   Particle Animation
   ======================================== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Initialize particles
const particles = [];
for (let i = 0; i < 120; i++) {
  particles.push({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    size: Math.random() * 2 + 1
  });
}

function animate() {
  ctx.clearRect(0, 0, width, height);

  particles.forEach(particle => {
    // Update position
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off walls
    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    // Draw particle
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });

  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
});

// Start animation
animate();

/* ========================================
   Smooth Scroll Navigation
   ======================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (event) {
    event.preventDefault();

    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

/* ========================================
   Copy to Clipboard - Button Handler
   ======================================== */
function copyWithButton(button, text) {
  navigator.clipboard.writeText(text).then(() => {
    button.classList.add('copied');
    setTimeout(() => {
      button.classList.remove('copied');
    }, 1200);
  });
}

/* ========================================
   Copy to Clipboard - Generic
   ======================================== */
function copyToClipboard(text) {
  let textToCopy = text;
  if (typeof text === 'object') {
    textToCopy = text.textContent;
  }
  navigator.clipboard.writeText(textToCopy);
}

/* ========================================
   Navbar Hide on Scroll
   ======================================== */
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener("scroll", function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 300) {
    // Scrolling Down - Hide navbar
    navbar.style.top = `-${navbar.offsetHeight}px`;
  } else {
    // Scrolling Up - Show navbar
    navbar.style.top = "0";
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

/* ========================================
   Scroll-Triggered Animations
   ======================================== */
const animationOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      
      // Add stagger delay for child elements
      if (entry.target.classList.contains('skills')) {
        const children = entry.target.querySelectorAll('.skill');
        children.forEach((child, index) => {
          child.style.animationDelay = (index * 0.1) + 's';
          child.classList.add('animate');
        });
      }
      
      if (entry.target.classList.contains('projects')) {
        const children = entry.target.querySelectorAll('.project-item');
        children.forEach((child, index) => {
          child.style.animationDelay = (index * 0.1) + 's';
          child.classList.add('animate');
        });
      }
      
      if (entry.target.classList.contains('contact-section')) {
        // Animate the READY text div
        const readyDiv = entry.target.querySelector('div:first-child');
        if (readyDiv) {
          readyDiv.classList.add('animate');
        }
        
        // Animate contact items with stagger
        const children = entry.target.querySelectorAll('.contact-item');
        children.forEach((child, index) => {
          child.style.animationDelay = (index * 0.15) + 's';
          child.classList.add('animate');
        });
      }
    }
  });
}, animationOptions);

// Observe sections that should animate on scroll
document.querySelectorAll('.section-title, .skills, .projects, .highlight, .contact-section').forEach(element => {
  observer.observe(element);
});

// Observe individual items
document.querySelectorAll('.project-item, .contact-item').forEach(element => {
  observer.observe(element);
});

/* ========================================
   Firebase — Dynamic Projects (Real-Time)
   ========================================
   Config is synced from admin.html.

   ⚠️  IMPORTANT — databaseURL is REQUIRED for
   Realtime Database. Find it in:
   Firebase Console → Realtime Database → Data tab
   It looks like:
   https://YOUR_PROJECT-rtdb.firebaseio.com
   ======================================== */
const firebaseConfig = {
  apiKey: "AIzaSyCzV_3AXHLtaMjfJEA4FH7vfxoxstk1wQ4",
  authDomain: "mportfolio-admin.firebaseapp.com",
  databaseURL: "https://mportfolio-admin-default-rtdb.firebaseio.com", // ← paste your actual URL here
  projectId: "mportfolio-admin",
  storageBucket: "mportfolio-admin.firebasestorage.app",
  messagingSenderId: "105882157212",
  appId: "1:105882157212:web:8c857a5e42f93d8371ad59"
};

// Initialise Firebase (guard against duplicate init)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const portfolioDb = firebase.database();

/* ========================================
   buildProjectCard — creates a card element
   ======================================== */
function buildProjectCard(proj, index) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.animationDelay = (index * 0.1) + 's';

  const imageHTML = proj.imageUrl
    ? `<div class="project-card-img">
         <img src="${escapeHtml(proj.imageUrl)}"
              alt="${escapeHtml(proj.title)}"
              loading="lazy"
              onerror="this.parentElement.innerHTML='<div class=\\'project-card-img-fallback\\'><i class=\\'fas fa-code\\'></i></div>'">
       </div>`
    : `<div class="project-card-img">
         <div class="project-card-img-fallback"><i class="fas fa-code"></i></div>
       </div>`;

  card.innerHTML = `
    ${imageHTML}
    <div class="project-card-body">
      <h3 class="project-card-title">${escapeHtml(proj.title)}</h3>
      <p class="project-card-desc">${escapeHtml(proj.description)}</p>
      <a class="project-card-btn"
         href="${escapeHtml(proj.projectLink)}"
         target="_blank"
         rel="noopener noreferrer">
        <i class="fas fa-arrow-up-right-from-square"></i> View Project
      </a>
    </div>`;

  return card;
}

/* ========================================
   listenProjects — real-time onValue listener
   Re-renders the full grid on every DB change.
   ======================================== */
function listenProjects() {
  const grid   = document.getElementById('projects-grid');
  const loader = document.getElementById('projects-loader');

  portfolioDb.ref('projects').orderByChild('createdAt')
    .on('value', snapshot => {

      // Remove spinner on first load (noop on subsequent calls)
      if (loader) loader.remove();

      // Clear previous cards before re-render
      grid.innerHTML = '';

      const data = snapshot.val();

      if (!data) {
        const empty = document.createElement('div');
        empty.className = 'projects-empty';
        empty.innerHTML = '<i class="fas fa-folder-open"></i><p>No projects yet — check back soon!</p>';
        grid.appendChild(empty);
        // Let the section animate in via observer
        observer.observe(grid);
        return;
      }

      // Render newest-first (reverse of createdAt order)
      const entries = Object.entries(data).reverse();

      entries.forEach(([, proj], index) => {
        const card = buildProjectCard(proj, index);
        grid.appendChild(card);

        // Register each new card with the Intersection Observer
        // so scroll-triggered animations work on dynamic elements
        observer.observe(card);
      });

      // Also observe the grid container itself for its own animation
      observer.observe(grid);

    }, err => {
      // Error handler (e.g. permission denied or bad databaseURL)
      console.error('Firebase onValue error:', err);
      const errEl = document.getElementById('projects-loader');
      if (errEl) {
        errEl.innerHTML = `<p style="color:#ef4444;font-family:Arial,sans-serif;font-size:13px;">
          Could not load projects.<br>
          Check the <code>databaseURL</code> in script.js and your Firebase rules.
        </p>`;
      } else {
        grid.innerHTML = `<p style="color:#ef4444;font-family:Arial,sans-serif;font-size:13px;text-align:center;padding:40px;">
          Could not load projects. Please check your Firebase config.
        </p>`;
      }
    });
}

/* ========================================
   XSS helper
   ======================================== */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#039;');
}

/* ========================================
   buildSkillCard — creates a .skill element
   Simple grid of square cards with skill name
   ======================================== */
function buildSkillCard(skill, index) {
  const div = document.createElement('div');
  div.className = 'skill';
  div.style.animationDelay = (index * 0.05) + 's';
  div.textContent = escapeHtml(skill.name); // XSS protection
  return div;
}

/* ========================================
   listenSkills — real-time onValue listener
   Renders a flat list of skills.
   ======================================== */
function listenSkills() {
  const container = document.getElementById('skills-container');
  const loader    = document.getElementById('skills-loader');

  portfolioDb.ref('skills').orderByChild('createdAt')
    .on('value', snapshot => {

      if (loader) loader.remove();
      container.innerHTML = '';

      const data = snapshot.val();

      if (!data) {
        const empty = document.createElement('div');
        empty.className = 'projects-empty';
        empty.style.cssText = 'grid-column:1/-1;text-align:center;padding:40px 20px;';
        empty.innerHTML = '<i class="fas fa-bolt"></i><p>No skills yet — check back soon!</p>';
        container.appendChild(empty);
        observer.observe(container);
        return;
      }

      // Flat render newest first (or by createdAt)
      const entries = Object.entries(data);
      entries.forEach(([key, skill], index) => {
        const card = buildSkillCard(skill, index);
        container.appendChild(card);
        observer.observe(card);
      });

      observer.observe(container);

    }, err => {
      console.error('Firebase skills error:', err);
      if (loader) {
        loader.innerHTML = '<p style="color:#ef4444;font-family:Arial,sans-serif;font-size:13px;">Could not load skills.</p>';
      }
    });
}

// Kick off real-time listener
listenProjects();
listenSkills();
