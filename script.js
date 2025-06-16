'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const countryNameInput = document.querySelector('.country__name__input');
const btnInput = document.querySelector('.input__btn');


// NEW COUNTRIES API URL (use instead of the URL shown in videos):
// https://restcountries.com/v2/name/portugal

// NEW REVERSE GEOCODING API URL (use instead of the URL shown in videos):
// https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}

///////////////////////////////////////

// Old AJAX syntax
const getCountryData = function(country) {

    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v2/name/${country}`);
    request.send();

    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);
        request.addEventListener('load', () => {
            console.log(request.responseText);

            const [data] = JSON.parse(request.responseText);
            console.log(data);

            const html = `
           <article class="country">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
    `;

            countriesContainer.insertAdjacentHTML('beforeend', html);
        })
    });
}
// getCountryData('spain');
// getCountryData('greece');
// getCountryData('germany');

const renderCountry = function(data, className = ''){
    const html = `
           <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
}

const renderCountryAplhaApi = function(data, className = ''){
    const html = `
           <article class="country ${className}">
          <img class="country__img" src="${data.flag}" />
          <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${data.population}</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>
    `;

    countriesContainer.insertAdjacentHTML('beforeend', html);
}

const getJSON = function(url, errorMsg = 'Something went wrong.') {
    return fetch(url).then(response => {
        if(!response.ok){
            throw new Error(errorMsg + ': ' + response.status);
        }
        return response.json();
    })
};

// New syntax with promises
const getCountryAndNeighbourOld = function(country){
    getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
        .then(data => {
            console.log(data);
            renderCountry(data[0]);
            // Get neighbour country (2)
            const neighbours = data[0].borders;
            console.log('Neighbours:', neighbours);

            return getJSON(`https://restcountries.com/v2/name/${neighbours[0]}`,
                'Neighbour country not found')
        })
        .then(data => {
            renderCountry(data[0],'neighbour');
        })
        .catch(err => alert(err))
        .finally(() => {
            countriesContainer.style.opacity = 1;
        })


        // // Get neighbour country (2)
        // const neighbours = data.borders;
        // console.log(neighbours[0]);
        //
        // const request1 = fetch(`https://restcountries.com/v2/alpha/${neighbours[0]}`);
        // request1.addEventListener('load', () => {
        //     const data1 = JSON.parse(request1.responseText);
        //     console.log(data1);
        //     renderCountry(data1,'neighbour');
        // });

};

const getPosition = function() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

const whereAmI = async function(){

    // Geolocation
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;
    console.log(lat, lng);
    // Reverse geocoding
    const resGeo = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`);
    if (!resGeo.ok) throw new Error('Problem getting location data');
    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    // Country data
    const res = await fetch(
        `https://restcountries.com/v2/name/${dataGeo.countryName.toLowerCase()}`,
    );
    console.log(res);
    if (!resGeo.ok) throw new Error('Problem getting country');
    const data = await res.json();
    console.log(data);

    renderCountry(data[0]);
    countriesContainer.style.opacity = 1;
};


// New syntax with async await
const getCountryAndNeighbour = async function(country){

    try{
        let data =  await getJSON(`https://restcountries.com/v2/name/${country}`, 'Country not found')
        renderCountry(data[0]);
        // Get neighbour country (2)
        const neighbours = data[0].borders;
        console.log(neighbours);
        if(neighbours.length > 3){
            neighbours.length = 3;
        }

        neighbours.map(async neighbour => {
            data = await getJSON(`https://restcountries.com/v2/alpha/${neighbour}`,
                  'Neighbour country not found');
            console.log(data);
            renderCountryAplhaApi(data,'neighbour');
        });

        countriesContainer.style.opacity = 1;
    }catch(err){alert(err)}

};

// getCountryAndNeighbour('greece');
//getCountryAndNeighbour('greece');

// when the app is loaded your current flag will be shown
whereAmI();

btnInput.addEventListener('click', function(e){
    e.preventDefault();
    countriesContainer.innerHTML = '';
    console.log(countryNameInput.value);
    const countryName = countryNameInput.value.toLowerCase();
    getCountryAndNeighbour(countryName);
});


