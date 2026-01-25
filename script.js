const steps = document.querySelectorAll('.step');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const progressBar = document.getElementById('progressBar');

let step = 0;

const state = {
  service: 'Deep Cleaning',
  base: 90,
  size: 1,
  frequency: 1,
  date: ''
};

/* SERVICE */
document.querySelectorAll('.options button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.options button').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    state.service = btn.dataset.service;
    state.base = Number(btn.dataset.price);
  });
});

/* INPUTS */
document.getElementById('homeSize').onchange = e => state.size = Number(e.target.value);
document.getElementById('frequency').onchange = e => state.frequency = Number(e.target.value);
document.getElementById('date').onchange = e => state.date = e.target.value;

function update() {
  steps.forEach((s, i) => s.classList.toggle('active', i === step));
  progressBar.style.width = `${((step + 1) / steps.length) * 100}%`;
  backBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
  nextBtn.style.display = step === steps.length - 1 ? 'none' : 'inline-block';

  if (step === steps.length - 1) {
    document.getElementById('sService').textContent = state.service;
    document.getElementById('sDate').textContent = state.date || 'Not selected';
    document.getElementById('sTotal').textContent =
      Math.round(state.base * state.size * state.frequency);
  }
}

nextBtn.onclick = () => {
  if (step < steps.length - 1) step++;
  update();
};

backBtn.onclick = () => {
  if (step > 0) step--;
  update();
};

document.getElementById('payBtn').onclick = () => {
  const total = Math.round(state.base * state.size * state.frequency);
  alert(`Redirecting to payment for $${total}`);
  // Stripe checkout here
};

update();

