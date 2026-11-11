/**
 * NextGen Software Solutions - Landing Page Interactive Scripts
 * Handles navigation, interactive tabs, dynamic periods, ROI calculator,
 * demo modals, client-side form validation, and scroll reveal animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileNavToggle');
  const mobileMenu = document.getElementById('mobileNavMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileToggle.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileToggle.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 2. Sticky Header elevation on scroll
  const siteHeader = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  });

  // 3. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // 4. Product Showcase Interactive Tabs & Period Filter
  const showcaseTabs = document.querySelectorAll('.showcase-tab');
  const tabPanels = {
    overview: document.getElementById('tabOverview'),
    receivables: document.getElementById('tabReceivables'),
    breakdown: document.getElementById('tabBreakdown')
  };

  showcaseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      showcaseTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.getAttribute('data-tab');
      Object.keys(tabPanels).forEach(key => {
        if (tabPanels[key]) {
          tabPanels[key].style.display = key === targetTab ? 'block' : 'none';
        }
      });
    });
  });

  // Showcase Period Switcher
  const periodButtons = document.querySelectorAll('.period-btn');
  const periodData = {
    month: {
      income: '₹1,84,500',
      expenses: '₹62,300',
      balance: '₹1,22,200',
      pending: '₹28,400',
      incomeTrend: '+14.2% vs previous',
      expenseTrend: '-3.8% controlled',
      chartPath: 'M 0,160 Q 60,110 120,130 T 240,80 T 360,50 T 480,90 T 600,40',
      chartExpense: 'M 0,180 Q 60,160 120,170 T 240,140 T 360,130 T 480,150 T 600,120'
    },
    last: {
      income: '₹1,61,200',
      expenses: '₹64,800',
      balance: '₹96,400',
      pending: '₹34,100',
      incomeTrend: '+8.1% steady',
      expenseTrend: '+2.1% higher fuel',
      chartPath: 'M 0,170 Q 60,140 120,150 T 240,100 T 360,90 T 480,110 T 600,70',
      chartExpense: 'M 0,175 Q 60,150 120,160 T 240,135 T 360,140 T 480,145 T 600,130'
    },
    quarter: {
      income: '₹5,32,000',
      expenses: '₹1,88,400',
      balance: '₹3,43,600',
      pending: '₹28,400',
      incomeTrend: '+18.5% quarter growth',
      expenseTrend: '-5.2% operational savings',
      chartPath: 'M 0,190 Q 60,150 120,120 T 240,70 T 360,60 T 480,45 T 600,20',
      chartExpense: 'M 0,180 Q 60,165 120,150 T 240,130 T 360,125 T 480,120 T 600,110'
    }
  };

  periodButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      periodButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const period = btn.getAttribute('data-period');
      const data = periodData[period];
      if (!data) return;

      const incEl = document.getElementById('metricIncome');
      const expEl = document.getElementById('metricExpense');
      const balEl = document.getElementById('metricBalance');
      const pndEl = document.getElementById('metricPending');
      const incTrEl = document.getElementById('trendIncome');
      const expTrEl = document.getElementById('trendExpense');
      const lineIncome = document.getElementById('showcaseLineIncome');
      const lineExpense = document.getElementById('showcaseLineExpense');

      if (incEl) incEl.textContent = data.income;
      if (expEl) expEl.textContent = data.expenses;
      if (balEl) balEl.textContent = data.balance;
      if (pndEl) pndEl.textContent = data.pending;
      if (incTrEl) incTrEl.innerHTML = `↑ ${data.incomeTrend}`;
      if (expTrEl) expTrEl.innerHTML = `↓ ${data.expenseTrend}`;
      if (lineIncome) lineIncome.setAttribute('d', data.chartPath);
      if (lineExpense) lineExpense.setAttribute('d', data.chartExpense);
    });
  });

  // 5. Interactive ROI / Bookkeeping Time Savings Calculator
  const txSlider = document.getElementById('sliderTransactions');
  const hoursSlider = document.getElementById('sliderHours');
  const txValLabel = document.getElementById('valTransactions');
  const hoursValLabel = document.getElementById('valHours');
  const hoursSavedResult = document.getElementById('resultHoursSaved');
  const moneyProtectedResult = document.getElementById('resultMoneyProtected');
  const efficiencyRateResult = document.getElementById('resultEfficiencyRate');

  function updateRoiCalculations() {
    if (!txSlider || !hoursSlider) return;
    const tx = parseInt(txSlider.value, 10);
    const weeklyHours = parseFloat(hoursSlider.value);

    if (txValLabel) txValLabel.textContent = `${tx} bills/day`;
    if (hoursValLabel) hoursValLabel.textContent = `${weeklyHours} hrs/wk`;

    // Monthly hours spent manually: weeklyHours * 4.33
    const monthlyManualHours = weeklyHours * 4.33;
    // With NextGen, digital tracking reduces manual reconciliation time by 75%
    const monthlyHoursSaved = Math.round(monthlyManualHours * 0.75);
    // Estimated forgotten payments protected based on daily transaction scale
    const estimatedRecoveredDues = Math.round(tx * 320);

    if (hoursSavedResult) hoursSavedResult.textContent = `${monthlyHoursSaved} hrs`;
    if (moneyProtectedResult) moneyProtectedResult.textContent = `₹${estimatedRecoveredDues.toLocaleString('en-IN')}`;
    if (efficiencyRateResult) efficiencyRateResult.textContent = '75%';
  }

  if (txSlider && hoursSlider) {
    txSlider.addEventListener('input', updateRoiCalculations);
    hoursSlider.addEventListener('input', updateRoiCalculations);
    updateRoiCalculations();
  }

  // 6. Demo Modal Logic
  const demoModal = document.getElementById('demoModal');
  const openDemoBtns = document.querySelectorAll('.open-demo-modal');
  const closeDemoBtn = document.getElementById('closeDemoModal');
  const demoForm = document.getElementById('demoModalForm');
  const demoSuccessState = document.getElementById('demoModalSuccess');

  function openModal() {
    if (demoModal) {
      demoModal.classList.add('open');
      demoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (demoModal) {
      demoModal.classList.remove('open');
      demoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (demoForm) demoForm.reset();
      if (demoSuccessState) demoSuccessState.style.display = 'none';
      if (demoForm) demoForm.style.display = 'block';
    }
  }

  openDemoBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeDemoBtn) {
    closeDemoBtn.addEventListener('click', closeModal);
  }

  if (demoModal) {
    demoModal.addEventListener('click', (e) => {
      if (e.target === demoModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && demoModal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Demo Modal Form Submission
  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = demoForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Scheduling Demo...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        demoForm.style.display = 'none';
        if (demoSuccessState) {
          demoSuccessState.style.display = 'block';
        }
      }, 800);
    });
  }

  // 7. Main Contact Form Validation & Submission State
  const contactForm = document.getElementById('mainContactForm');
  const contactSuccessBanner = document.getElementById('contactSuccessBanner');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasError = false;
      const fullName = document.getElementById('fullName');
      const businessName = document.getElementById('businessName');
      const email = document.getElementById('email');
      const phone = document.getElementById('phone');
      const message = document.getElementById('message');

      const fields = [fullName, businessName, email, phone, message];

      fields.forEach(field => {
        if (!field) return;
        if (!field.value.trim()) {
          field.classList.add('error');
          hasError = true;
        } else {
          field.classList.remove('error');
        }
      });

      // Basic email validation
      if (email && email.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
          email.classList.add('error');
          hasError = true;
        }
      }

      if (hasError) return;

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Enquiry...';

      // Simulate network request
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();

        if (contactSuccessBanner) {
          contactSuccessBanner.classList.add('visible');
          contactSuccessBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 700);
    });

    // Clear error class on typing
    contactForm.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.remove('error');
        }
      });
    });
  }

  // 8. Interactive Debtor Reminder Simulation Button
  const reminderButtons = document.querySelectorAll('.send-reminder-btn');
  reminderButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const client = btn.getAttribute('data-client') || 'customer';
      const originalText = btn.textContent;
      btn.textContent = '✓ Reminder Sent!';
      btn.style.background = '#059669';
      btn.style.color = '#ffffff';
      btn.disabled = true;

      // Toast feedback
      showToast(`Friendly WhatsApp payment reminder queued for ${client}. (Interactive Demo)`);

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        btn.disabled = false;
      }, 3500);
    });
  });

  // Mini Toast Notification System
  function showToast(text) {
    let toast = document.getElementById('liveToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'liveToast';
      toast.style.position = 'fixed';
      toast.style.bottom = '24px';
      toast.style.right = '24px';
      toast.style.backgroundColor = '#0a1124';
      toast.style.color = '#ffffff';
      toast.style.padding = '14px 22px';
      toast.style.borderRadius = '12px';
      toast.style.boxShadow = '0 15px 35px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1)';
      toast.style.fontSize = '0.875rem';
      toast.style.fontWeight = '650';
      toast.style.zIndex = '9999';
      toast.style.display = 'flex';
      toast.style.alignItems = 'center';
      toast.style.gap = '10px';
      toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="color:#34d399">●</span> ${text}`;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
    }, 3200);
  }
});
