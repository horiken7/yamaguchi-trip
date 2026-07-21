(() => {
  const menuButton = document.getElementById('menuButton');
  const navLinks = document.getElementById('navLinks');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰';
      });
    });
  }

  const dayTabs = [...document.querySelectorAll('.day-tab')];
  const dayPanels = [...document.querySelectorAll('.day-panel')];

  dayTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.day;
      dayTabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle('active', active);
        item.setAttribute('aria-selected', String(active));
      });
      dayPanels.forEach((panel) => {
        const active = panel.id === target;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
    });
  });

  const countdown = document.getElementById('countdown');
  if (countdown) {
    const departure = new Date('2026-08-12T08:00:00+09:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = departure.getTime() - now.getTime();
      if (diff <= 0) {
        countdown.textContent = now < new Date('2026-08-15T00:00:00+09:00') ? '旅行期間中です！' : '楽しい思い出を振り返ろう';
        return;
      }
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      countdown.textContent = `${days}日 ${hours}時間`;
    };
    updateCountdown();
    setInterval(updateCountdown, 60000);
  }

  const budgetFields = [...document.querySelectorAll('.budget-field')];
  const budgetTotal = document.getElementById('budgetTotal');
  const perPerson = document.getElementById('perPerson');
  const yen = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY', maximumFractionDigits: 0 });

  const updateBudget = () => {
    const total = budgetFields.reduce((sum, field) => {
      const value = Number(field.value);
      return sum + (Number.isFinite(value) && value > 0 ? value : 0);
    }, 0);
    if (budgetTotal) budgetTotal.textContent = yen.format(total);
    if (perPerson) perPerson.textContent = yen.format(Math.round(total / 2));
  };

  budgetFields.forEach((field) => field.addEventListener('input', updateBudget));
  updateBudget();

  const packInputs = [...document.querySelectorAll('[data-pack]')];
  const packingProgress = document.getElementById('packingProgress');
  const progressBar = document.getElementById('progressBar');
  const resetPacking = document.getElementById('resetPacking');
  const storageKey = 'yamaguchiTripPacking2026';

  const getPackingState = () => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch {
      return {};
    }
  };

  const savePackingState = () => {
    const state = {};
    packInputs.forEach((input) => {
      state[input.dataset.pack] = input.checked;
    });
    localStorage.setItem(storageKey, JSON.stringify(state));
  };

  const renderPacking = () => {
    const checked = packInputs.filter((input) => input.checked).length;
    const total = packInputs.length;
    if (packingProgress) packingProgress.textContent = `${checked} / ${total}`;
    if (progressBar) progressBar.style.width = total ? `${(checked / total) * 100}%` : '0%';
  };

  const savedPacking = getPackingState();
  packInputs.forEach((input) => {
    input.checked = Boolean(savedPacking[input.dataset.pack]);
    input.addEventListener('change', () => {
      savePackingState();
      renderPacking();
    });
  });
  renderPacking();

  if (resetPacking) {
    resetPacking.addEventListener('click', () => {
      packInputs.forEach((input) => { input.checked = false; });
      localStorage.removeItem(storageKey);
      renderPacking();
    });
  }

  const tripMemo = document.getElementById('tripMemo');
  const memoSaved = document.getElementById('memoSaved');
  const memoKey = 'yamaguchiTripMemo2026';
  let memoTimer;

  if (tripMemo) {
    tripMemo.value = localStorage.getItem(memoKey) || '';
    tripMemo.addEventListener('input', () => {
      localStorage.setItem(memoKey, tripMemo.value);
      if (memoSaved) memoSaved.textContent = '保存しました';
      clearTimeout(memoTimer);
      memoTimer = setTimeout(() => {
        if (memoSaved) memoSaved.textContent = '';
      }, 1800);
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  });
})();
