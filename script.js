// ============================================
// DOM ELEMENTS
// ============================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contactForm');

// ============================================
// ENHANCED SMOOTH SCROLL
// ============================================
// Polyfill for older browsers
if (!window.CSS || !window.CSS.supports('scroll-behavior', 'smooth')) {
    document.documentElement.style.scrollBehavior = 'auto';
}

// Smooth scroll with offset for fixed navbar
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            const duration = 1000; // 1 second
            let start = null;

            // Request animation frame for smooth scrolling
            window.requestAnimationFrame(function step(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                const percent = Math.min(progress / duration, 1);

                // Easing function for smooth motion
                const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                window.scrollTo(0, startPosition + distance * easeInOutQuad(percent));

                if (progress < duration) {
                    window.requestAnimationFrame(step);
                }
            });
        }
    });
});
// ============================================
// MOBILE MENU TOGGLE
// ============================================
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// PROJECT FILTERING
// ============================================
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects
        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.6s ease-out';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = 'rgba(2, 132, 199, 0.2)';
    } else {
        navbar.style.borderBottomColor = 'transparent';
    }
});

// ============================================
// CONTACT FORM SUBMISSION
// ============================================
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
            email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
            message: formData.get('message') || contactForm.querySelector('textarea').value
        };

        try {
            const subject = `New Contact from ${data.name}`;
            const body = `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`;
            window.location.href = `mailto:sohailms873@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            showNotification('Message prepared! Your email client will open.', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Error sending message. Please try again.', 'error');
        }
    });
}

// ============================================
// NOTIFICATION HELPER
// ============================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#38bdf8' : '#ef4444'};
        color: #0f172a;
        border-radius: 4px;
        font-weight: 600;
        z-index: 2000;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 4px 6px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-category, .cert-card, .timeline-content').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// ADD CSS ANIMATIONS TO DOM
// ============================================
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { opacity: 0; transform: translateX(100px); }
        to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100px); }
    }
`;
document.head.appendChild(style);

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const navHeight = document.querySelector('.navbar').offsetHeight;
    navLinks.forEach(link => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#')) {
            const targetElement = document.getElementById(targetId.substring(1));
            if (targetElement) {
                const targetPosition = targetElement.offsetTop;
                const targetEnd = targetPosition + targetElement.offsetHeight;
                if (window.scrollY + navHeight >= targetPosition && window.scrollY < targetEnd) {
                    navLinks.forEach(l => l.style.color = 'var(--text-light)');
                    link.style.color = 'var(--accent)';
                    if (link.classList.contains('resume-btn')) {
                        link.style.borderColor = 'var(--accent)';
                    }
                }
            }
        }
    });
});

// ============================================
// CONSOLE GREETING
// ============================================
console.log('%c Welcome to Shaik Mahammad Sohel\'s Portfolio!', 'color: #0284c7; font-size: 16px; font-weight: bold;');
console.log('%c DevOps Engineer | Full-Stack Developer | Cloud Enthusiast', 'color: #64748b; font-size: 14px;');
console.log('%c 📧 sohailms873@gmail.com | 📱 +91 8523058397', 'color: #334155; font-size: 12px;');

// ============================================
// RESUME GENERATION
// ============================================
const resumeBtn = document.querySelector('.resume-btn'); // Fixed selector
const resumeData = {
    name: "Shaik Anjum",
    title: "Software Developer | Automation Enthusiast",
    email: "shaiklaharaanjum@gmail.com",
    phone: "+91 6281132793",
    location: "Kurnool, Andhra Pradesh",
    about: `Passionate and motivated B.Tech student seeking an internship opportunity to apply and enhance software development and automation skills in a real-world environment. Dedicated to continuous learning and problem-solving through hands-on experience.`,
    education: [
        { date: "2023 - 2027", degree: "B.Tech in Computer Science & Engineering", school: "G Pulla Reddy Engineering College (7.98%)" },
        { date: "2023", degree: "Senior Secondary (XII) - Science", school: "Oxford Vit Academy (94.80%)" },
        { date: "2021", degree: "Secondary (X)", school: "D A V High School (10.00 CGPA)" }
    ],
    skills: ["Java", "Python", "HTML/CSS", "JavaScript", "React", "Spring Boot", "FastAPI", "PostgreSQL", "Data Science", "Machine Learning", "Power BI", "Tableau", "GitHub"],
    projects: [
        { name: "Voice To-Do App", desc: "Productivity web app with voice commands.", link: "https://github.com/Anjum1104/voice_todo_app" },
        { name: "Titanic Survival Prediction", desc: "ML model predicting survival based on passenger data.", link: "https://github.com/Anjum1104/titanic-survival-predictions" },
        { name: "Content Scraping & Enhancement", desc: "Tool to scrape and enhance web content.", link: "https://github.com/Anjum1104/BeyondChats_Scraping_Content_Enhancement" },
        { name: "Live Clock (IST)", desc: "Real-time clock with glassmorphic UI.", link: "https://github.com/Anjum1104/clock" },
        { name: "Budget Tracker", desc: "PHP-based finance tracking application.", link: "https://github.com/Anjum1104/budget_tracker" }
    ],
    certifications: [
        { title: "Entrepreneurship", issuer: "NPTEL, Online", link: "" },
        { title: "Community Service", issuer: "Volunteer", link: "" }
    ],
    profileImage: "" // Removed as per request
};

function buildResumeHTML(d) {
    return `
  <!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Resume - ${d.name}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <style>
      :root{--bg:#fff;--card:#f8f9fa;--accent:#0284c7;--text:#334155}
      body{font-family:Inter,Segoe UI,Arial,sans-serif;margin:0;background:#fff;color:#111}
      .page{max-width:900px;margin:20px auto;padding:28px;background:#fff;border:1px solid #ddd}
      header{display:flex;gap:24px;align-items:center}
      .avatar{width:120px;height:120px;border-radius:8px;object-fit:cover;border:3px solid var(--accent)}
      .head-info h1{margin:0;font-size:24px}
      .head-info p{margin:4px 0;color:#333}
      .section{margin-top:18px}
      h2{font-size:16px;margin:0 0 8px 0;color:#222;border-bottom:1px solid #eee;padding-bottom:6px}
      ul{margin:8px 0 0 18px;padding:0}
      li{margin-bottom:6px;color:#333}
      .meta{color:#555;font-size:14px}
      .two-col{display:flex;gap:20px}
      .left{flex:2}
      .right{flex:1}
      .skills{display:flex;flex-wrap:wrap;gap:6px}
      .skill{background:#f0f9ff;padding:6px 8px;border-radius:6px;font-size:13px;color:var(--accent)}
      .print-actions{position:fixed;top:12px;right:12px}
      .btn{background:var(--accent);color:#fff;padding:8px 12px;border-radius:6px;border:none;cursor:pointer}
      @media print {
        .print-actions{display:none}
        body{margin:0}
        .page{border:none;box-shadow:none;margin:0}
      }
    </style>
  </head>
  <body>
    <div class="print-actions">
      <button class="btn" onclick="window.print()">Print / Save PDF</button>
      <button class="btn" onclick="window.close()" style="margin-left:8px">Close</button>
    </div>

    <div class="page" id="resumePage">
      <header>
        <img src="${d.profileImage}" alt="${d.name}" class="avatar" onerror="this.style.display='none'">
        <div class="head-info">
          <h1>${d.name}</h1>
          <p class="meta">${d.title} • ${d.location}</p>
          <p class="meta">📧 ${d.email} • 📱 ${d.phone}</p>
        </div>
      </header>
      <div class="section two-col">
        <div class="left">
          <h2>About</h2>
          <p class="meta">${d.about}</p>
          <h2 style="margin-top:16px">Experience & Projects</h2>
          <ul>${d.projects.map(p => `<li><strong>${p.name}:</strong> ${p.desc} ${p.link ? `<a href="${p.link}" target="_blank">${p.link}</a>` : ''}</li>`).join('')}</ul>
          <h2 style="margin-top:16px">Certifications</h2>
          <ul>${d.certifications.map(c => `<li><strong>${c.title}</strong> — ${c.issuer}</li>`).join('')}</ul>
        </div>
        <aside class="right">
          <h2>Education</h2>
          <ul>${d.education.map(e => `<li><strong>${e.degree}</strong><br><span class="meta">${e.school} • ${e.date}</span></li>`).join('')}</ul>
          <h2 style="margin-top:12px">Skills</h2>
          <div class="skills">${d.skills.map(s => `<span class="skill">${s}</span>`).join('')}</div>
        </aside>
      </div>
    </div>
    <script>setTimeout(() => { try { window.print(); } catch(e) {} }, 700);</script>
  </body>
  </html>`;
}

if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const newWin = window.open('', '_blank', 'toolbar=yes,scrollbars=yes,resizable=yes,width=900,height=800');
        if (newWin) {
            newWin.document.write(buildResumeHTML(resumeData));
            newWin.document.close();
            newWin.focus();
        } else {
            alert('Please allow popups to view the resume.');
        }
    });
}

