// ===== State =====
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
let customCategories = JSON.parse(localStorage.getItem('customCategories') || '[]');
let chart = null;

// ===== DOM References =====
const form = document.getElementById('transactionForm');
const itemNameInput = document.getElementById('itemName');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const customCategoryGroup = document.getElementById('customCategoryGroup');
const customCategoryInput = document.getElementById('customCategory');
const customOption = document.getElementById('customOption');
const spendingLimitInput = document.getElementById('spendingLimit');
const errorMsg = document.getElementById('errorMsg');
const totalBalanceEl = document.getElementById('totalBalance');
const transactionList = document.getElementById('transactionList');
const emptyState = document.getElementById('emptyState');
const noChartData = document.getElementById('noChartData');
const sortBySelect = document.getElementById('sortBy');
const themeToggle = document.getElementById('themeToggle');

// ===== Init =====
function init() {
  loadCustomCategories();
  loadTheme();
  render();
}

// ===== Custom Categories =====
function loadCustomCategories() {
  customCategories.forEach(cat => addCategoryOption(cat));
  if (customCategories.length > 0 || true) {
    customOption.style.display = 'block'; // always show "Custom" option
  }
}

function addCategoryOption(name) {
  // avoid duplicates
  const existing = [...categorySelect.options].find(o => o.value === name);
  if (existing) return;
  const opt = document.createElement('option');
  opt.value = name;
  opt.textContent = `✏️ ${name}`;
  // insert before the "Custom" option
  categorySelect.insertBefore(opt, customOption);
}

categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'Custom') {
    customCategoryGroup.style.display = 'block';
    customCategoryInput.focus();
  } else {
    customCategoryGroup.style.display = 'none';
    customCategoryInput.value = '';
  }
});

// ===== Form Submit =====
form.addEventListener('submit', (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const name = itemNameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  let category = categorySelect.value;
  const limit = parseFloat(spendingLimitInput.value) || 0;

  // Handle custom category
  if (category === 'Custom') {
    const customName = customCategoryInput.value.trim();
    if (!customName) {
      errorMsg.textContent = 'Please enter a custom category name.';
      return;
    }
    category = customName;
    if (!customCategories.includes(category)) {
      customCategories.push(category);
      localStorage.setItem('customCategories', JSON.stringify(customCategories));
      addCategoryOption(category);
    }
  }

  // Validation
  if (!name) { errorMsg.textContent = 'Item name is required.'; return; }
  if (!amount || amount <= 0) { errorMsg.textContent = 'Please enter a valid amount.'; return; }
  if (!category) { errorMsg.textContent = 'Please select a category.'; return; }

  const transaction = {
    id: Date.now(),
    name,
    amount,
    category,
    limit,
    date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  };

  transactions.push(transaction);
  save();
  render();

  // Reset form
  form.reset();
  customCategoryGroup.style.display = 'none';
});

// ===== Delete =====
function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  save();
  render();
}

// ===== Save =====
function save() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// ===== Render =====
function render() {
  renderBalance();
  renderList();
  renderChart();
}

function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  totalBalanceEl.textContent = formatRupiah(total);
}

function renderList() {
  const sorted = getSorted([...transactions]);

  if (sorted.length === 0) {
    transactionList.innerHTML = '';
    transactionList.appendChild(emptyState);
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  transactionList.innerHTML = '';

  sorted.forEach(t => {
    const isOverLimit = t.limit > 0 && t.amount > t.limit;
    const li = document.createElement('li');
    li.className = 'transaction-item' + (isOverLimit ? ' over-limit' : '');

    const dotClass = ['Food', 'Transport', 'Fun'].includes(t.category)
      ? `dot-${t.category}` : 'dot-Custom';

    li.innerHTML = `
      <div class="category-dot ${dotClass}"></div>
      <div class="item-info">
        <div class="item-name">${escapeHtml(t.name)}${isOverLimit ? '<span class="over-limit-badge">⚠️ Over Limit</span>' : ''}</div>
        <div class="item-meta">${t.category} · ${t.date}</div>
      </div>
      <div class="item-amount">-${formatRupiah(t.amount)}</div>
      <button class="btn-delete" title="Delete" onclick="deleteTransaction(${t.id})">🗑️</button>
    `;
    transactionList.appendChild(li);
  });
}

function getSorted(list) {
  const sort = sortBySelect.value;
  if (sort === 'amount-asc') return list.sort((a, b) => a.amount - b.amount);
  if (sort === 'amount-desc') return list.sort((a, b) => b.amount - a.amount);
  if (sort === 'category') return list.sort((a, b) => a.category.localeCompare(b.category));
  return list.sort((a, b) => b.id - a.id); // date desc (default)
}

sortBySelect.addEventListener('change', renderList);

// ===== Chart =====
const CHART_COLORS = {
  Food: '#ff6b6b',
  Transport: '#4ecdc4',
  Fun: '#ffe66d',
};

function getColor(category, index) {
  if (CHART_COLORS[category]) return CHART_COLORS[category];
  const extras = ['#a29bfe', '#fd79a8', '#00b894', '#fdcb6e', '#e17055', '#74b9ff'];
  return extras[index % extras.length];
}

function renderChart() {
  const ctx = document.getElementById('spendingChart').getContext('2d');

  // Aggregate by category
  const totals = {};
  transactions.forEach(t => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(totals);
  const data = Object.values(totals);
  const colors = labels.map((l, i) => getColor(l, i));

  if (labels.length === 0) {
    noChartData.style.display = 'block';
    if (chart) { chart.destroy(); chart = null; }
    return;
  }

  noChartData.style.display = 'none';

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: getComputedStyle(document.body).getPropertyValue('--surface') || '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text') || '#1a1a2e',
            padding: 12,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${formatRupiah(ctx.parsed)}`
          }
        }
      }
    }
  });
}

// ===== Dark/Light Mode =====
function loadTheme() {
  const dark = localStorage.getItem('darkMode') === 'true';
  if (dark) {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark);
  renderChart(); // re-render chart with updated colors
});

// ===== Helpers =====
function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ===== Start =====
init();
