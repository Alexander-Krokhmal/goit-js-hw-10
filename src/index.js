import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.searchBox.addEventListener('input', debounce(onSearchCountries, DEBOUNCE_DELAY));

// Fetch.fetchCountries();


function onSearchCountries(evt) {
    evt.preventDefault();

    const name = evt.target.value.trim();
    console.log(name);

    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';


    if (!name) {
        return;
    }

    fetchCountries(name).then(countries => {
        console.log(countries);

        if (countries.length > 10) {
            return Notify.info("Too many matches found. Please enter a more specific name.");
        }
        renderCountryList(countries);
    }).catch(err => Notify.failure("Oops, there is no country with that name"));

}

function renderCountryList(countries) {
    if (countries.length === 1) {
        renderCountryInfo(countries);
    } else {
        const markup = countries
            .map(({flags, name}) => {
                return `
                <li class="country-list__item">
                    <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 50px>
                    <p class="country-list__name">${name.official}</p>
                </li>
                `;
            }).join("");
    refs.countryInfo.innerHTML = markup;
    }
}

function renderCountryInfo(countries) {
    const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<img width="200px" height="100px" src='${flags.svg}' alt='${name.official} flag' />
        <ul class="country-info__list">
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${name.official}</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages)}</p></li>
        </ul>`;
    })
    .join('');
    refs.countryInfo.innerHTML = markup;
}