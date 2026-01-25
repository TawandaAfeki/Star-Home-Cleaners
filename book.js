const stepContainer = document.getElementById('stepContainer');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const progressBar = document.getElementById('progressBar');

let stepIndex = 0;
let steps = [];

const state = {
  service: null,
  bedrooms: 0,
  bathrooms: 0,
  location: '',
  frequency: 1,
  date: '',
  moveSize: '',
  age: '',
  specialNeeds: '',
  email: '',
  phone: ''
};


/* -------------------------
   SERVICE DEFINITIONS
-------------------------- */
const SERVICES = {
  standard: {
    name: 'Standard Cleaning',
    steps: ['service', 'rooms', 'location', 'frequency', 'date', 'contact', 'summary'],
    pricing: () =>
      (state.bedrooms * 120 + state.bathrooms * 150) * state.frequency
  },
  deep: {
    name: 'Deep Cleaning',
    steps: ['service', 'rooms', 'location', 'frequency', 'date', 'contact', 'summary'],
    pricing: () =>
      (state.bedrooms * 180 + state.bathrooms * 200) * state.frequency
  },
  moving: {
    name: 'Moving Services',
    steps: ['service', 'moving', 'date', 'contact', 'summary'],
    pricing: () => ({
      small: 1000,
      medium: 1500,
      large: 3000
    })[state.moveSize]
  },
  care: {
    name: 'Care Giving',
    steps: ['service', 'care', 'location', 'frequency', 'date', 'contact', 'summary'],
    pricing: () => 2500 * state.frequency
  },
  gardening: {
  name: 'Gardening Services',
  steps: ['service', 'location', 'date', 'contact', 'summary'],
  pricing: () => 500
}

};


/* -------------------------
   STEP RENDERERS
-------------------------- */
function renderStep() {
  const step = steps[stepIndex];

  progressBar.style.width =
    ((stepIndex + 1) / steps.length) * 100 + '%';

  backBtn.style.visibility = stepIndex === 0 ? 'hidden' : 'visible';
  nextBtn.disabled = false;

if (steps[stepIndex] !== 'summary') {
  nextBtn.disabled = false;
}


  if (step === 'service') {
    stepContainer.innerHTML = `
      <h1>Select a Service</h1>
      <button onclick="selectService('standard')">Standard Cleaning</button>
<button onclick="selectService('deep')">Deep Cleaning</button>
<button onclick="selectService('gardening')">
  Garden Landscaping
</button>
<button onclick="selectService('moving')">Moving Services</button>
<button onclick="selectService('care')">Care Giving</button>


    `;
  }

  if (step === 'rooms') {
    stepContainer.innerHTML = `
      <h1>Bedrooms & Bathrooms</h1>
      <input type="number" placeholder="Bedrooms" min="0"
        oninput="state.bedrooms = +this.value">
      <input type="number" placeholder="Bathrooms" min="0"
        oninput="state.bathrooms = +this.value">
    `;
  }

  if (step === 'moving') {
    stepContainer.innerHTML = `
      <h1>Move details</h1>
      <input placeholder="Pickup location"
        oninput="state.location = this.value">
      <input placeholder="Drop-off location">
      <select onchange="state.moveSize = this.value">
        <option value="">Select size</option>
        <option value="small">Small (R1000)</option>
        <option value="medium">Medium (R1500)</option>
        <option value="large">Large (R3000)</option>
      </select>
    `;
  }

  if (step === 'care') {
    stepContainer.innerHTML = `
      <h1>Care Details</h1>
      <input type="number" placeholder="Age"
        oninput="state.age = this.value">
      <textarea placeholder="Special Needs"
        oninput="state.specialNeeds = this.value"></textarea>
    `;
  }

  if (step === 'location') {
    stepContainer.innerHTML = `
      <h1>Service Location</h1>
      <input
  id="locationInput"
  type="text"
  placeholder="Start typing your address..."
/>
    `;
  }
  
setTimeout(() => {
  const input = document.getElementById('locationInput');
  if (!input) return;

  const autocomplete = new google.maps.places.Autocomplete(input, {
    types: ['geocode'],
    componentRestrictions: { country: 'za' } // South Africa
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (!place.formatted_address) return;

    state.location = place.formatted_address;

    // Optional: store coordinates (VERY useful later)
    state.lat = place.geometry.location.lat();
    state.lng = place.geometry.location.lng();
  });
}, 0);

  if (step === 'frequency') {
    stepContainer.innerHTML = `
      <h1>How Often?</h1>
      <select onchange="state.frequency = +this.value">
        <option value="1">One-time</option>
        <option value="0.85">Weekly (save 15%)</option>
        <option value="0.9">Bi-weekly (save 10%)</option>
        <option value="0.95">Monthly (save 5%)</option>
      </select>
    `;
  }

  if (step === 'date') {
    stepContainer.innerHTML = `
      <h1>Select Date</h1>
      <input type="date" onchange="state.date = this.value">
    `;
  }

  if (step === 'summary') {
  const total = SERVICES[state.service].pricing();

  stepContainer.innerHTML = `
    <h1>Booking Summary</h1>

    <p><strong>Service:</strong> ${SERVICES[state.service].name}</p>
    <p><strong>Email:</strong> ${state.email}</p>
    <p><strong>Phone:</strong> ${state.phone}</p>
    <p><strong>Total:</strong> R${total}</p>

    <button onclick="alert('Proceeding to payment')">
      Pay Now
    </button>
  `;
}


  if (step === 'contact') {
  stepContainer.innerHTML = `
    <h1>Contact Details</h1>

    <input
      type="email"
      placeholder="Email Address"
      value="${state.email}"
      oninput="state.email = this.value"
    />

    <input
      type="tel"
      placeholder="Phone Number"
      value="${state.phone}"
      oninput="state.phone = this.value"
    />
  `;
}
}

/* -------------------------
   ACTIONS
-------------------------- */
window.selectService = (service) => {
  state.service = service;
  steps = SERVICES[service].steps;
  stepIndex = 1;
  renderStep();
};

nextBtn.onclick = () => {
  const current = steps[stepIndex];

  if (!validateStep(current)) {
    return;
  }

  stepIndex++;
  renderStep();
};


backBtn.onclick = () => {
  stepIndex--;
  renderStep();
};

/* INIT */
steps = ['service'];
renderStep();

function clearErrors() {
  document.querySelectorAll('.error').forEach(e => e.remove());
  document
    .querySelectorAll('.error-field')
    .forEach(el => el.classList.remove('error-field'));
}

function showError(element, message) {
  element.classList.add('error-field');
  const error = document.createElement('div');
  error.className = 'error';
  error.textContent = message;
  element.after(error);
}

function validateStep(step) {
  clearErrors();
  let valid = true;

  if (step === 'rooms') {
    if (!state.bedrooms || state.bedrooms <= 0) {
      showError(
        document.querySelector('input[placeholder="Bedrooms"]'),
        'Please enter number of bedrooms'
      );
      valid = false;
    }

    if (!state.bathrooms || state.bathrooms <= 0) {
      showError(
        document.querySelector('input[placeholder="Bathrooms"]'),
        'Please enter number of bathrooms'
      );
      valid = false;
    }
  }

  if (step === 'location') {
    if (!state.location.trim()) {
      showError(
        document.querySelector('input[placeholder="Enter address"]'),
        'Location is Required'
      );
      valid = false;
    }
  }

  if (step === 'moving') {
    const inputs = document.querySelectorAll('#stepContainer input');

    if (!inputs[0].value.trim()) {
      showError(inputs[0], 'Pickup Location is Required');
      valid = false;
    }

    if (!inputs[1].value.trim()) {
      showError(inputs[1], 'Drop-off Location is Required');
      valid = false;
    }

    if (!state.moveSize) {
      showError(
        document.querySelector('select'),
        'Please select move size'
      );
      valid = false;
    }
  }

  if (step === 'care') {
    if (!state.age || state.age <= 0) {
      showError(
        document.querySelector('input[type="number"]'),
        'Please enter age'
      );
      valid = false;
    }

    if (!state.specialNeeds.trim()) {
      showError(
        document.querySelector('textarea'),
        'Please describe special needs'
      );
      valid = false;
    }
  }

  if (step === 'date') {
    if (!state.date) {
      showError(
        document.querySelector('input[type="date"]'),
        'Please select a date'
      );
      valid = false;
    }
  }

  if (step === 'contact') {
  const emailInput = document.querySelector('input[type="email"]');
  const phoneInput = document.querySelector('input[type="tel"]');

  if (!state.email || !state.email.includes('@')) {
    showError(emailInput, 'Please enter a valid email address');
    valid = false;
  }

  if (!state.phone || state.phone.length < 8) {
    showError(phoneInput, 'Please enter a valid phone number');
    valid = false;
  }
}


  return valid;
}
