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
  phone: '',
  extras: {
  oven: 0,
  windows: 0,
  walls: 0
}
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
const EXTRAS_PRICES = {
  oven: 150,
  windows: 150,
  walls: 200
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

  // Hide Next button on final (summary) step
if (step === 'summary') {
  nextBtn.style.display = 'none';
} else {
  nextBtn.style.display = 'inline-block';
}


if (steps[stepIndex] !== 'summary') {
  nextBtn.disabled = false;
}


  if (step === 'service') {
  stepContainer.innerHTML = `
    <h1>Select a Service</h1>

    <button onclick="selectService('standard')">
      <span class="title">Standard Cleaning</span>
      <span class="subtitle"><small>Regular Maintenance</small></span>
    </button>

    <button onclick="selectService('deep')">
      <span class="title">Deep Cleaning</span>
      <span class="subtitle"><small>Detailed Maintenance</small></span>
    </button>

    <button onclick="selectService('gardening')">
      <span class="title">Garden Landscaping</span>
      <span class="subtitle"><small>Detailed Outdoor Maintenance</small></span>
    </button>

    <button onclick="selectService('moving')">
      <span class="title">Moving Services</span>
      <span class="subtitle"><small>Complete Property Clean</small></span>
    </button>

    <button onclick="selectService('care')">
      <span class="title">Care Giving</span>
      <span class="subtitle"><small>Assisting People in Need</small></span>
    </button>
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

    <input
      id="pickupInput"
      type="text"
      placeholder="Start typing your pick-up address..."
    />

    <input
      id="dropoffInput"
      type="text"
      placeholder="Start typing your drop-off address..."
    />

    <select
      id="moveSizeSelect"
      onchange="state.moveSize = this.value"
    >
      <option value="">Select size</option>
      <option value="small" ${state.moveSize === 'small' ? 'selected' : ''}>
        Small
      </option>
      <option value="medium" ${state.moveSize === 'medium' ? 'selected' : ''}>
        Medium
      </option>
      <option value="large" ${state.moveSize === 'large' ? 'selected' : ''}>
        Large
      </option>
    </select>
  `;
}

setTimeout(() => {
  const pickupInput = document.getElementById('pickupInput');
  const dropoffInput = document.getElementById('dropoffInput');

  if (pickupInput) {
    const pickupAutocomplete = new google.maps.places.Autocomplete(
      pickupInput,
      {
        types: ['geocode'],
        componentRestrictions: { country: 'za' }
      }
    );

    pickupAutocomplete.addListener('place_changed', () => {
      const place = pickupAutocomplete.getPlace();
      if (!place.formatted_address) return;

      state.pickupLocation = place.formatted_address;
      state.pickupLat = place.geometry.location.lat();
      state.pickupLng = place.geometry.location.lng();
    });
  }

  if (dropoffInput) {
    const dropoffAutocomplete = new google.maps.places.Autocomplete(
      dropoffInput,
      {
        types: ['geocode'],
        componentRestrictions: { country: 'za' }
      }
    );

    dropoffAutocomplete.addListener('place_changed', () => {
      const place = dropoffAutocomplete.getPlace();
      if (!place.formatted_address) return;

      state.dropoffLocation = place.formatted_address;
      state.dropoffLat = place.geometry.location.lat();
      state.dropoffLng = place.geometry.location.lng();
    });
  }
}, 0);


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
        <option value="1">Once</option>
        <option value="0.85">Weekly <small>15% off</small></option>
        <option value="0.9">Bi-weekly <small>10% off</small></option>
        <option value="0.95">Monthly <small>5% off</small></option>
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
  const baseTotal = SERVICES[state.service].pricing();

const extrasTotal =
  state.extras.oven * EXTRAS_PRICES.oven +
  state.extras.windows * EXTRAS_PRICES.windows +
  state.extras.walls * EXTRAS_PRICES.walls;

const total = baseTotal + extrasTotal;

let extrasHTML = '';

const extrasAllowed = ['standard', 'deep', 'moving'].includes(state.service);

if (extrasAllowed) {
  extrasHTML = `
    <h3>Add extras</h3>

    <div class="cart-item">
      <span>Oven Cleaning</span>
      <div class="qty">
        <button type="button" onclick="updateExtra('oven', -1)">−</button>
        <span>${state.extras.oven}</span>
        <button type="button" onclick="updateExtra('oven', 1)">+</button>
        
      </div>
    </div>

    <div class="cart-item">
      <span>Window Cleaning</span>
      <div class="qty">
        <button type="button" onclick="updateExtra('windows', -1)">−</button>
        <span>${state.extras.windows}</span>
        <button type="button" onclick="updateExtra('windows', 1)">+</button>
        
      </div>
    </div>

    <div class="cart-item">
      <span>Wall Cleaning</span>
      <div class="qty">
        <button type="button" onclick="updateExtra('walls', -1)">−</button>
        <span>${state.extras.walls}</span>
        <button type="button" onclick="updateExtra('walls', 1)">+</button>
        
      </div>
    </div>
  `;
}


  let cartItems = '';

  if (state.service === 'standard' || state.service === 'deep') {
    cartItems = `
      <div class="cart-item">
        <span>Bedrooms</span>
        <div class="qty">
          <button type="button" onclick="updateQty('bedrooms', -1)">−</button>
<span>${state.bedrooms}</span>
<button type="button" onclick="updateQty('bedrooms', 1)">+</button>

        </div>
      </div>

      <div class="cart-item">
        <span>Bathrooms</span>
        <div class="qty">
          <button type="button" onclick="updateQty('bathrooms', -1)">−</button>
<span>${state.bathrooms}</span>
<button type="button" onclick="updateQty('bathrooms', 1)">+</button>

        </div>
      </div>
    `;
  }

  stepContainer.innerHTML = `
    <h1>Review Your Booking</h1>

    <!-- BOOKING DETAILS -->
    <div class="summary-block">
      <p><strong>Service:</strong> ${SERVICES[state.service].name}</p>
      <p><strong>Location:</strong> ${state.location} </p>
      <p><strong>Date:</strong> ${state.date}</p>
      ${state.frequency !== 1 ? `<p><strong>Frequency:</strong> Applied ${state.frequency}</p>` : ''}
      <p><strong>Email:</strong> ${state.email}</p>
      <p><strong>Phone:</strong> ${state.phone}</p>
    </div>

    <div class="cart">
  ${cartItems}
  ${extrasHTML}

  <div class="cart-total">
    <span>Total</span>
    <strong>R${total}</strong>
  </div>
</div>


    <button class="pay-btn" onclick="alert('Proceeding to payment')">
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
        'Please Enter Number of Bedrooms'
      );
      valid = false;
    }

    if (!state.bathrooms || state.bathrooms <= 0) {
      showError(
        document.querySelector('input[placeholder="Bathrooms"]'),
        'Please Enter Number of Bathrooms'
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
  if (!state.pickupLocation) {
    showError(
      document.getElementById('pickupInput'),
      'Pick-up Location is Required'
    );
    valid = false;
  }

  if (!state.dropoffLocation) {
    showError(
      document.getElementById('dropoffInput'),
      'Drop-off Location is Required'
    );
    valid = false;
  }

  if (!state.moveSize) {
    showError(
      document.getElementById('moveSizeSelect'),
      'Please Select Move Size'
    );
    valid = false;
  }
}

  if (step === 'care') {
    if (!state.age || state.age <= 0) {
      showError(
        document.querySelector('input[type="number"]'),
        'Please Enter Age'
      );
      valid = false;
    }

    if (!state.specialNeeds.trim()) {
      showError(
        document.querySelector('textarea'),
        'Please Describe Special Needs'
      );
      valid = false;
    }
  }

  if (step === 'date') {
    if (!state.date) {
      showError(
        document.querySelector('input[type="date"]'),
        'Please Select a Date'
      );
      valid = false;
    }
  }

  if (step === 'contact') {
  const emailInput = document.querySelector('input[type="email"]');
  const phoneInput = document.querySelector('input[type="tel"]');

  if (!state.email || !state.email.includes('@')) {
    showError(emailInput, 'Please Enter a Valid Email Address');
    valid = false;
  }

  if (!state.phone || state.phone.length < 8) {
    showError(phoneInput, 'Please Enter a Valid Phone Number');
    valid = false;
  }
}


  return valid;
}
window.updateQty = function (field, change) {
  state[field] += change;

  if (state[field] < 1) {
    state[field] = 1;
  }

  renderStep();
};
window.updateExtra = function (extra, change) {
  state.extras[extra] += change;

  if (state.extras[extra] < 0) {
    state.extras[extra] = 0;
  }

  renderStep();
};

