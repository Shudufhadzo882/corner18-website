/**
 * Corner18 General Construction - Interactive Application Logic
 * Light Blue Theme + Real Photo Slideshow
 */

document.addEventListener('DOMContentLoaded', () => {

  // =====================================================================
  // HERO PHOTO SLIDESHOW
  // =====================================================================
  const slides      = document.querySelectorAll('.slide');
  const dots        = document.querySelectorAll('.dot');
  const thumbs      = document.querySelectorAll('.slide-thumb');
  const prevBtn     = document.getElementById('sliderPrev');
  const nextBtn     = document.getElementById('sliderNext');
  const progressBar = document.getElementById('slideProgress');

  const SLIDE_INTERVAL = 2500; // ms between auto-advances
  let currentSlide  = 0;
  let slideTimer    = null;
  let progressAnim  = null;

  const slideMeta = [
    { label: 'Our Brick Yard • Mphaphuli, Thohoyandou' },
    { label: 'Live From Our Central Depot' },
    { label: 'High-Grade Concrete Bricks In Stock' },
    { label: 'On-Site Operations At The Yard' },
    { label: 'Building Materials Ready For Delivery' },
    { label: 'Lufule-Tshififi Road • Site Access Route' },
    { label: 'Bricks & Bulk Water Delivered Daily' },
  ];

  function goToSlide(n) {
    // wrap around
    n = ((n % slides.length) + slides.length) % slides.length;

    // deactivate old
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    thumbs[currentSlide].classList.remove('active');

    currentSlide = n;

    // activate new
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    thumbs[currentSlide].classList.add('active');

    // update caption label
    const labelEl = document.getElementById('slideLabel');
    if (labelEl) {
      labelEl.style.opacity = '0';
      setTimeout(() => {
        labelEl.textContent = slideMeta[currentSlide].label;
        labelEl.style.opacity = '1';
        labelEl.style.transition = 'opacity 0.5s ease';
      }, 250);
    }

    // reset & restart progress bar
    startProgressBar();
  }

  function startProgressBar() {
    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      // force reflow
      void progressBar.offsetWidth;
      progressBar.style.transition = `width ${SLIDE_INTERVAL}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  function startAutoPlay() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_INTERVAL);
    startProgressBar();
  }

  function pauseAutoPlay() {
    clearInterval(slideTimer);
    if (progressBar) {
      const computedWidth = window.getComputedStyle(progressBar).width;
      const containerWidth = progressBar.parentElement.offsetWidth;
      const pct = (parseFloat(computedWidth) / containerWidth * 100).toFixed(1);
      progressBar.style.transition = 'none';
      progressBar.style.width = pct + '%';
    }
  }

  // Arrow buttons
  prevBtn?.addEventListener('click', () => { goToSlide(currentSlide - 1); startAutoPlay(); });
  nextBtn?.addEventListener('click', () => { goToSlide(currentSlide + 1); startAutoPlay(); });

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); startAutoPlay(); });
  });

  // Thumbnail clicks
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => { goToSlide(i); startAutoPlay(); });
  });

  // Pause on hover
  const sliderEl = document.querySelector('.hero-slider');
  sliderEl?.addEventListener('mouseenter', pauseAutoPlay);
  sliderEl?.addEventListener('mouseleave', startAutoPlay);

  // Touch / swipe support
  let touchStartX = 0;
  sliderEl?.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  sliderEl?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      goToSlide(currentSlide + (dx < 0 ? 1 : -1));
      startAutoPlay();
    }
  });

  // Keyboard arrows
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); startAutoPlay(); }
    if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startAutoPlay(); }
  });

  // Kick off
  startAutoPlay();

  // =====================================================================
  // PHONE / WHATSAPP NUMBER STATE
  // =====================================================================
  let activePhoneNumber = "27768191591"; // Official WhatsApp number

  const phoneConfigBtn     = document.getElementById('phoneConfigBtn');
  const phoneModal         = document.getElementById('phoneModal');
  const closePhoneModal    = document.getElementById('closePhoneModal');
  const savePhoneBtn       = document.getElementById('savePhoneBtn');
  const modalPhoneInput    = document.getElementById('modalPhoneInput');
  const currentPhoneDisplay = document.getElementById('currentPhoneDisplay');
  const locPhoneText       = document.getElementById('locPhoneText');
  const footerPhoneVals    = document.querySelectorAll('.footerPhoneVal');

  function updateAllWhatsappLinks(newPhone) {
    activePhoneNumber = newPhone.replace(/[^0-9]/g, '');
    if (!activePhoneNumber.startsWith('27') && activePhoneNumber.startsWith('0')) {
      activePhoneNumber = '27' + activePhoneNumber.substring(1);
    }
    const d = activePhoneNumber;
    const formatted = `+${d.substring(0,2)} ${d.substring(2,4)} ${d.substring(4,7)} ${d.substring(7)}`;
    if (currentPhoneDisplay) currentPhoneDisplay.textContent = `WhatsApp: ${formatted} | Call: 072 313 6794`;
    if (locPhoneText) locPhoneText.innerHTML = `💬 <strong>WhatsApp:</strong> <a href="https://wa.me/${activePhoneNumber}">${formatted}</a><br>📞 <strong>Calls / Landline:</strong> <a href="tel:0723136794">072 313 6794</a>`;
    footerPhoneVals.forEach(el => { el.href = `https://wa.me/${activePhoneNumber}`; el.textContent = formatted; });
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      try {
        const url = new URL(link.href);
        const txt = url.searchParams.get('text') || 'Hi Corner18, I would like to inquire about bricks/water';
        link.href = `https://wa.me/${activePhoneNumber}?text=${encodeURIComponent(txt)}`;
      } catch { /* non-url */ }
    });
  }

  savePhoneBtn?.addEventListener('click', () => {
    const val = modalPhoneInput?.value.trim();
    if (val) { updateAllWhatsappLinks(val); phoneModal.style.display = 'none'; }
  });
  phoneConfigBtn?.addEventListener('click', () => {
    if (modalPhoneInput) modalPhoneInput.value = activePhoneNumber;
    if (phoneModal) phoneModal.style.display = 'flex';
  });
  closePhoneModal?.addEventListener('click', () => { if (phoneModal) phoneModal.style.display = 'none'; });

  window.addEventListener('click', e => {
    if (e.target === phoneModal) phoneModal.style.display = 'none';
  });

  // =====================================================================
  // MOBILE NAV
  // =====================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks     = document.getElementById('navLinks');

  mobileToggle?.addEventListener('click', () => navLinks?.classList.toggle('open'));
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // =====================================================================
  // PRICE CALCULATOR
  // =====================================================================
  const calcService        = document.getElementById('calcService');
  const smallQtyGroup      = document.getElementById('smallQtyGroup');
  const largeQtyGroup      = document.getElementById('largeQtyGroup');
  const calcSmallQty       = document.getElementById('calcSmallQty');
  const calcLargeQty       = document.getElementById('calcLargeQty');
  const calcDeliveryOption = document.getElementById('calcDeliveryOption');
  const calcLocationGroup  = document.getElementById('calcLocationGroup');
  const calcLocation       = document.getElementById('calcLocation');
  const calcItemsSubtotal  = document.getElementById('calcItemsSubtotal');
  const calcTransportLabel = document.getElementById('calcTransportLabel');
  const calcTransportFee   = document.getElementById('calcTransportFee');
  const calcGrandTotal     = document.getElementById('calcGrandTotal');
  const sendCalcBtn         = document.getElementById('sendCalcToWhatsappBtn');

  function fmt(n) { return `R${n.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }

  let currentLoadsCount = 0;

  function calculateTotal() {
    const svc = calcService?.value;
    let itemsTotal = 0;
    let sQty = 0;
    let lQty = 0;

    if (svc === 'small_bricks') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'block';
      if (largeQtyGroup) largeQtyGroup.style.display = 'none';
      sQty = parseInt(calcSmallQty?.value) || 0;
      itemsTotal = sQty * 2.00;
    } else if (svc === 'large_bricks') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'none';
      if (largeQtyGroup) largeQtyGroup.style.display = 'block';
      lQty = parseInt(calcLargeQty?.value) || 0;
      itemsTotal = lQty * 4.00;
    } else if (svc === 'both_bricks') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'block';
      if (largeQtyGroup) largeQtyGroup.style.display = 'block';
      sQty = parseInt(calcSmallQty?.value) || 0;
      lQty = parseInt(calcLargeQty?.value) || 0;
      itemsTotal = (sQty * 2.00) + (lQty * 4.00);
    } else if (svc === 'water_2500') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'none';
      if (largeQtyGroup) largeQtyGroup.style.display = 'none';
      itemsTotal = 500.00;
    } else if (svc === 'water_5000') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'none';
      if (largeQtyGroup) largeQtyGroup.style.display = 'none';
      itemsTotal = 900.00;
    } else if (svc === 'sand_bou') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'none';
      if (largeQtyGroup) largeQtyGroup.style.display = 'none';
      itemsTotal = 900.00;
    } else if (svc === 'sand_river') {
      if (smallQtyGroup) smallQtyGroup.style.display = 'none';
      if (largeQtyGroup) largeQtyGroup.style.display = 'none';
      itemsTotal = 900.00;
    }

    const isDelivery = calcDeliveryOption ? calcDeliveryOption.value === 'delivery' : true;
    if (calcLocationGroup) {
      calcLocationGroup.style.display = isDelivery ? 'block' : 'none';
    }

    let transportFee = 0;
    currentLoadsCount = 0;

    if (isDelivery) {
      if (svc === 'small_bricks' && sQty > 0) {
        // R600 per 2,000 small bricks
        currentLoadsCount = Math.ceil(sQty / 2000);
        transportFee = currentLoadsCount * 600;
      } else if (svc === 'large_bricks' && lQty > 0) {
        // R600 per 1,000 large bricks
        currentLoadsCount = Math.ceil(lQty / 1000);
        transportFee = currentLoadsCount * 600;
      } else if (svc === 'both_bricks' && (sQty > 0 || lQty > 0)) {
        // Combined truck load capacity (2k small or 1k large per full load)
        const loadRatio = (sQty / 2000) + (lQty / 1000);
        currentLoadsCount = Math.ceil(loadRatio);
        transportFee = currentLoadsCount * 600;
      } else if (svc.startsWith('water_')) {
        // Water includes free local tanker transport
        currentLoadsCount = 1;
        transportFee = 0;
      } else if (svc.startsWith('sand_')) {
        // Sand includes free local transport
        currentLoadsCount = 1;
        transportFee = 0;
      }
    }

    const grand = itemsTotal + transportFee;

    if (calcItemsSubtotal) calcItemsSubtotal.textContent = fmt(itemsTotal);
    if (calcTransportLabel) {
      if (!isDelivery) {
        calcTransportLabel.textContent = 'Transport (Self-Collection):';
      } else if (svc.startsWith('water_')) {
        calcTransportLabel.textContent = 'Local Delivery:';
      } else if (svc.startsWith('sand_')) {
        calcTransportLabel.textContent = 'Local Delivery:';
      } else {
        calcTransportLabel.textContent = `Transport Fee (${currentLoadsCount} Load${currentLoadsCount !== 1 ? 's' : ''}):`;
      }
    }
    if (calcTransportFee) {
      if (!isDelivery) {
        calcTransportFee.textContent = 'R0.00 (Own Pick-up)';
      } else if (svc.startsWith('water_')) {
        calcTransportFee.textContent = 'FREE ✅';
      } else if (svc.startsWith('sand_')) {
        calcTransportFee.textContent = 'FREE ✅';
      } else {
        calcTransportFee.textContent = fmt(transportFee);
      }
    }
    if (calcGrandTotal) calcGrandTotal.textContent = fmt(grand);
  }

  calcService?.addEventListener('change', calculateTotal);
  calcSmallQty?.addEventListener('input',  calculateTotal);
  calcLargeQty?.addEventListener('input',  calculateTotal);
  calcDeliveryOption?.addEventListener('change', calculateTotal);
  calcLocation?.addEventListener('change', calculateTotal);
  calculateTotal();

  sendCalcBtn?.addEventListener('click', () => {
    const svcName      = calcService?.options[calcService.selectedIndex]?.text || '';
    const isDelivery   = calcDeliveryOption ? calcDeliveryOption.value === 'delivery' : true;
    const locName      = calcLocation?.options[calcLocation.selectedIndex]?.text || '';
    const itemsCost    = calcItemsSubtotal?.textContent || '';
    const transportTxt = calcTransportFee?.textContent || '';
    const grandTotal   = calcGrandTotal?.textContent || '';

    let msg = `Hi Corner18! Website Order Estimate:\n\n• Service: ${svcName}\n`;
    if (calcSmallQty && smallQtyGroup?.style.display !== 'none') msg += `• Small Bricks: ${calcSmallQty.value} units (R2.00 ea)\n`;
    if (calcLargeQty && largeQtyGroup?.style.display !== 'none') msg += `• Large Bricks: ${calcLargeQty.value} units (R4.00 ea)\n`;
    msg += `• Items Subtotal: ${itemsCost}\n`;
    
    if (isDelivery) {
      msg += `• Delivery Option: Site Delivery (${locName})\n`;
      if (svc.startsWith('water_')) {
        msg += `• Delivery Fee: FREE Local Delivery\n`;
      } else if (svc.startsWith('sand_')) {
        msg += `• Delivery Fee: FREE Local Delivery\n`;
      } else {
        msg += `• Transport Fee: ${transportTxt} (R600/1k Large, R600/2k Small)\n`;
      }
    } else {
      msg += `• Delivery Option: Customer Self-Collection at Yard (R0 Transport)\n`;
    }
    msg += `\n• Estimated Grand Total: ${grandTotal}\n\nPlease confirm product availability and earliest delivery slot!`;
    window.open(`https://wa.me/${activePhoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  });

  // =====================================================================
  // SERVICE CARD BUTTONS → scroll to form
  // =====================================================================
  document.querySelectorAll('.trigger-order-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const svc = btn.getAttribute('data-service');
      const sel = document.getElementById('serviceNeeded');
      if (sel) sel.value = svc;
      document.getElementById('quote-form')?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // =====================================================================
  // QUOTE REQUEST FORM SUBMISSION
  // =====================================================================
  const quoteForm       = document.getElementById('quoteRequestForm');
  const formSuccess     = document.getElementById('formSuccessMessage');
  const directSendWaBtn = document.getElementById('directSendWaBtn');

  quoteForm?.addEventListener('submit', e => {
    e.preventDefault();
    const name     = document.getElementById('fullName')?.value.trim();
    const phone    = document.getElementById('phoneNumber')?.value.trim();
    const service  = document.getElementById('serviceNeeded')?.value;
    const qty      = document.getElementById('quantityNeeded')?.value.trim();
    const location = document.getElementById('deliveryLocation')?.value.trim();
    const notes    = document.getElementById('additionalNotes')?.value.trim();

    let msg = `Hi Corner18! Quote & Delivery Request:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📦 Service: ${service}\n🔢 Quantity: ${qty}\n📍 Delivery: ${location}`;
    if (notes) msg += `\n📝 Notes: ${notes}`;
    msg += `\n\nPlease confirm and advise on delivery slot!`;

    const waUrl = `https://wa.me/${activePhoneNumber}?text=${encodeURIComponent(msg)}`;
    if (directSendWaBtn) directSendWaBtn.href = waUrl;
    if (quoteForm)   quoteForm.style.display   = 'none';
    if (formSuccess) formSuccess.style.display  = 'block';
    window.open(waUrl, '_blank');
  });

  // =====================================================================
  // SCROLL-REVEAL ANIMATIONS
  // =====================================================================
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  }

  // =====================================================================
  // FLOATING WHATSAPP BUTTON — show after scrolling past hero
  // =====================================================================
  const waFab        = document.getElementById('waFab');
  const heroSection  = document.querySelector('.hero-slider');
  if (waFab && heroSection) {
    const toggleFab = () => waFab.classList.toggle('show', window.scrollY > heroSection.offsetHeight - 140);
    window.addEventListener('scroll', toggleFab, { passive: true });
    toggleFab();
  }

});
