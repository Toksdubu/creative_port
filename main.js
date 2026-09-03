/* ==========================================================================
   Creative Portfolio - Interactive JavaScript Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  /* --------------------------------------------------------------------------
     0. Hero Interactive Floating Particles Engine
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.6,
        alpha: Math.random() * 0.6 + 0.15,
        speedY: Math.random() * 0.5 + 0.15,
        speedX: (Math.random() - 0.5) * 0.3,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;

        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          p.x -= (dx / dist) * 0.8;
          p.y -= (dy / dist) * 0.8;
        }

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }

  /* --------------------------------------------------------------------------
     1. Premiere Timeline Scrubber & Animation Widget
     -------------------------------------------------------------------------- */
  const playhead = document.getElementById('playhead');
  const timelineBody = document.getElementById('timeline-body');
  const playBtn = document.getElementById('timeline-play-btn');
  const playIcon = document.getElementById('play-icon');
  const timecodeDisplay = document.getElementById('timecode-display');

  let isPlaying = false;
  let playheadPos = 35; // percentage (0 to 100)
  let animationFrameId = null;

  function updateTimecode(percent) {
    const totalFrames = Math.floor((percent / 100) * 1800); // 30 sec * 60fps = 1800 frames
    const minutes = Math.floor(totalFrames / (60 * 60));
    const seconds = Math.floor((totalFrames % (60 * 60)) / 60);
    const frames = totalFrames % 60;
    
    const pad = (num) => String(num).padStart(2, '0');
    timecodeDisplay.textContent = `00:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  }

  function setPlayheadPosition(percent) {
    playheadPos = Math.max(0, Math.min(100, percent));
    playhead.style.left = `${playheadPos}%`;
    updateTimecode(playheadPos);
  }

  function stepPlayback() {
    if (!isPlaying) return;
    playheadPos += 0.15;
    if (playheadPos > 98) {
      playheadPos = 0;
    }
    setPlayheadPosition(playheadPos);
    animationFrameId = requestAnimationFrame(stepPlayback);
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        playBtn.style.background = 'var(--pr-purple-dark)';
        playBtn.innerHTML = '<i data-lucide="pause"></i>';
        if (window.lucide) lucide.createIcons();
        stepPlayback();
      } else {
        playBtn.style.background = 'rgba(255, 255, 255, 0.05)';
        playBtn.innerHTML = '<i data-lucide="play"></i>';
        if (window.lucide) lucide.createIcons();
        cancelAnimationFrame(animationFrameId);
      }
    });
  }

  // Interactive Drag Scrubber
  if (timelineBody) {
    let isDraggingTimeline = false;

    const handleScrub = (e) => {
      const rect = timelineBody.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percent = (clickX / rect.width) * 100;
      setPlayheadPosition(percent);
    };

    timelineBody.addEventListener('mousedown', (e) => {
      isDraggingTimeline = true;
      handleScrub(e);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingTimeline) {
        handleScrub(e);
      }
    });

    window.addEventListener('mouseup', () => {
      isDraggingTimeline = false;
    });
  }


  /* --------------------------------------------------------------------------
     2. Interactive Color Grade Before / After Comparison Slider
     -------------------------------------------------------------------------- */
  const cgSlider = document.getElementById('cg-slider');
  const cgBeforeLayer = document.getElementById('cg-before-layer');
  const cgHandle = document.getElementById('cg-handle');

  if (cgSlider && cgBeforeLayer && cgHandle) {
    let isDraggingCG = false;

    const setSliderPos = (xPos) => {
      const rect = cgSlider.getBoundingClientRect();
      let offsetX = xPos - rect.left;
      offsetX = Math.max(0, Math.min(rect.width, offsetX));
      const percentage = (offsetX / rect.width) * 100;

      cgBeforeLayer.style.width = `${percentage}%`;
      cgHandle.style.left = `${percentage}%`;
    };

    cgSlider.addEventListener('mousedown', (e) => {
      isDraggingCG = true;
      setSliderPos(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (isDraggingCG) {
        setSliderPos(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      isDraggingCG = false;
    });

    // Touch support for mobile
    cgSlider.addEventListener('touchstart', (e) => {
      isDraggingCG = true;
      setSliderPos(e.touches[0].clientX);
    });
    window.addEventListener('touchmove', (e) => {
      if (isDraggingCG) {
        setSliderPos(e.touches[0].clientX);
      }
    });
    window.addEventListener('touchend', () => {
      isDraggingCG = false;
    });
  }


  /* --------------------------------------------------------------------------
     3. Portfolio Category Filtering
     -------------------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (card.style.opacity === '0') {
              card.style.display = 'none';
            }
          }, 200);
        }
      });
    });
  });


  /* --------------------------------------------------------------------------
     4. Project Preview Lightbox Modal
     -------------------------------------------------------------------------- */
  const modal = document.getElementById('project-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalDoneBtn = document.getElementById('modal-done-btn');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const videoFrame = document.getElementById('modal-video-frame');

  function openModal(title, desc, videoSrc, embedSrc) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = desc;

    if (videoFrame) {
      if (videoSrc) {
        // Local MP4 video player
        videoFrame.innerHTML = `
          <video src="${videoSrc}" controls autoplay style="width: 100%; height: 100%; object-fit: contain; border-radius: 8px; background: #000;">
            Your browser does not support HTML5 video.
          </video>
        `;
      } else if (embedSrc) {
        // YouTube / Vimeo embed iframe
        videoFrame.innerHTML = `
          <iframe src="${embedSrc}" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 8px;"></iframe>
        `;
      } else {
        // Default placeholder fallback
        videoFrame.innerHTML = `
          <div style="text-align: center; padding: 20px;">
            <i data-lucide="film" style="width: 48px; height: 48px; color: #ffffff; margin-bottom: 12px;"></i>
            <p style="color: var(--text-muted);">${desc}</p>
          </div>
        `;
        if (window.lucide) lucide.createIcons();
      }
    }

    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (videoFrame) videoFrame.innerHTML = '';
    if (modal) modal.classList.remove('active');
  }

  workCards.forEach(card => {
    // Hover video preview playback
    const thumbVideo = card.querySelector('.work-thumb video');
    if (thumbVideo) {
      card.addEventListener('mouseenter', () => {
        thumbVideo.play().catch(() => {});
      });
      card.addEventListener('mouseleave', () => {
        thumbVideo.pause();
      });
    }

    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title') || 'Featured Project';
      const desc = card.getAttribute('data-desc') || '';
      const videoSrc = card.getAttribute('data-video');
      const embedSrc = card.getAttribute('data-embed');
      openModal(title, desc, videoSrc, embedSrc);

      // Force instant play on modal video
      if (videoFrame) {
        const modalVid = videoFrame.querySelector('video');
        if (modalVid) {
          modalVid.play().catch(() => {});
        }
      }
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalDoneBtn) modalDoneBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  /* --------------------------------------------------------------------------
     5. Contact Form Submission Toast
     -------------------------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent! I will respond within 24 hours.');
      contactForm.reset();
    });
  }


  /* --------------------------------------------------------------------------
     6. Navigation Highlight on Scroll
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSection = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
});
