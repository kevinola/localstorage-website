const COUNTRIES_URL = 'https://cdn.jsdelivr.net/gh/dr5hn/countries-states-cities-database@master/json/countries.json';
const STATES_URL = 'https://cdn.jsdelivr.net/gh/dr5hn/countries-states-cities-database@master/json/states.json';
const CITIES_URL = 'https://cdn.jsdelivr.net/gh/dr5hn/countries-states-cities-database@master/json/cities.json';

let allStates = [];
let allCities = [];

async function initCDNLocationSelector() {
  const countrySelect = document.getElementById('country');
  const stateSelect = document.getElementById('state');
  const citySelect = document.getElementById('city');

  if (!countrySelect || !stateSelect || !citySelect) return;

  try {
    const response = await fetch(COUNTRIES_URL);
    const countries = await response.json();
    countries.sort((a, b) => a.name.localeCompare(b.name));

    countrySelect.innerHTML = '<option value="">-- Select Country --</option>';
    countries.forEach((country) => {
      const option = document.createElement('option');
      option.value = String(country.id);
      option.textContent = `${country.emoji || ''} ${country.name}`;
      countrySelect.appendChild(option);
    });
  } catch (error) {
    console.warn('Unable to load countries list:', error);
  }

  countrySelect.addEventListener('change', async function () {
    const countryId = this.value;
    stateSelect.innerHTML = '<option value="">-- Select State --</option>';
    citySelect.innerHTML = '<option value="">-- Select City --</option>';

    if (!countryId) return;

    try {
      if (!allStates.length) {
        const response = await fetch(STATES_URL);
        allStates = await response.json();
      }

      const filteredStates = allStates.filter((state) => String(state.country_id) === String(countryId));
      filteredStates.forEach((stateItem) => {
        const option = document.createElement('option');
        option.value = String(stateItem.id);
        option.textContent = stateItem.name;
        stateSelect.appendChild(option);
      });
    } catch (error) {
      console.warn('Unable to load states list:', error);
    }
  });

  stateSelect.addEventListener('change', async function () {
    const stateId = this.value;
    citySelect.innerHTML = '<option value="">-- Select City --</option>';

    if (!stateId) return;

    try {
      if (!allCities.length) {
        const response = await fetch(CITIES_URL);
        allCities = await response.json();
      }

      const filteredCities = allCities.filter((city) => String(city.state_id) === String(stateId));
      filteredCities.forEach((cityItem) => {
        const option = document.createElement('option');
        option.value = cityItem.name;
        option.textContent = cityItem.name;
        citySelect.appendChild(option);
      });
    } catch (error) {
      console.warn('Unable to load cities list:', error);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCDNLocationSelector);
}
