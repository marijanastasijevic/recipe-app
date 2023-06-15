const mealsEl = document.getElementById('meals');
const favoriteContainer = document.getElementById("fav-meals");

const searchTerm = document.getElementById('search-term');
const searchBtn = document.getElementById('search');

const mealInfoEl = document.getElementById('meal-info')
const mealPopup = document.getElementById('meal-popup');
const mealPopupBtn = document.getElementById('close-popup')

getRandomMeal();
fetchFavMeals();

async function getRandomMeal(){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")

    const respData = await response.json();
    const randomMeal = respData.meals[0]

    console.log(randomMeal);

    addMeal(randomMeal, true)
    
}



async function getMealById(id){
    const resp = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);

    const respData = await resp.json();
    const meal = respData.meals[0];

    return meal
}

async function getMealsBySearch(term){
   const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+term)


   const respData = await resp.json();
   const meals = respData.meals;

   return meals;
}

//postavljanje vrednosti parametru funkcije je difoltna vrenost
function addMeal(mealData, random = false){
    const meal = document.createElement("div");
    meal.classList.add('meal');

    meal.innerHTML = `
        <div class="meal-header">
            ${random ? ` <span class="random">Random Recipe</span>` : ''}
           
            <img 
                src="${mealData.strMealThumb}" 
                alt="${mealData.strMeal}"
            />
        </div>

        <div class="meal-body">
            <h2>${mealData.strMeal}</h2>
            <button class="fav-btn">
                <i class="fa-regular fa-heart"></i></i>
            </button>
        </div>   
    `

    const btn =  meal.querySelector('.meal-body .fav-btn');

    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')){
            console.log(`Remove meal ${mealData.idMeal}`)
            removeMealfromLS(mealData.idMeal);
            btn.classList.remove('active')
        }
        else{
            console.log(`Add meal ${mealData.idMeal}`)
            addMealtoLS(mealData.idMeal);
            btn.classList.add('active')
            
        }
        
        //clean the container
        fetchFavMeals();
    })

    meal.addEventListener('click', () => {
        showMealInfo(mealData)
    })

    mealsEl.appendChild(meal);
}

function addMealtoLS(mealId){
    const mealIds = getMealsfromLS()
    localStorage.setItem("mealIds", JSON.stringify([...mealIds, mealId]))

}

function removeMealfromLS(mealId){
    const mealIds = getMealsfromLS();

    localStorage.setItem("mealIds", JSON.stringify(mealIds.filter((id) => id !== mealId))) 
}

function getMealsfromLS(){
    const mealIds = JSON.parse(localStorage.getItem("mealIds"));

    return mealIds === null ? [] : mealIds;
}

async function fetchFavMeals(){
    // clean the container
    favoriteContainer.innerHTML = '';

    const mealIds = getMealsfromLS();

    for(let i = 0; i < mealIds.length; i++){
        const mealId = mealIds[i];
        const meal = await getMealById(mealId)

        addMealtoFav(meal);

        console.log(meals);

        // add them to the screen

    }
}

function addMealtoFav(mealData){
    const favMeal = document.createElement("li");
   
    favMeal.innerHTML = `
        
        <img 
            src="${mealData.strMealThumb}" 
            alt="${mealData.strMeal}"
        />
        <span>${mealData.strMeal}</span>
        <button class='clear'><i class="fa-regular fa-rectangle-xmark"></i></button>
    `

    const btn = favMeal.querySelector('.clear')

    btn.addEventListener('click', () => {
       removeMealfromLS(mealData.idMeal) 

       fetchFavMeals();
    });

    favMeal.addEventListener('click', () => {
        showMealInfo(mealData)
    })



    favoriteContainer.appendChild(favMeal);
}

//zato sto dobijamo promis mora async/await
searchBtn.addEventListener('click', async() => {
    // clean the container
    mealsEl.innerHTML = '';
    const search = searchTerm.value;

    const meals = await getMealsBySearch(search);

    if(meals){
        meals.forEach(meal => {
            addMeal(meal)
        })
    }

})

function showMealInfo (mealData) {
    //clean it up
    mealInfoEl.innerHTML = '';

    //update meal info
    const mealEl = document.createElement('div');

    //get ingredients and mesures
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        if (mealData["strIngredient" + i]) {
            ingredients.push(
                `${mealData["strIngredient" + i]} - ${
                    mealData["strMeasure" + i]
                }`
            );
        } else {
            break;
        }
    }

    mealEl.innerHTML = 
    `
        <h1>${mealData.strMeal}</h1>
        <img src="${mealData.strMealThumb}" alt="${mealData.strMeal}">

        <p>${mealData.strInstructions}</p>

        <h3>Ingredients:</h3>
        <ul>
            ${ingredients
                .map(
                    (ing) => `
            <li>${ing}</li>
            `
                )
                .join("")}
        </ul>
    `

    mealInfoEl.appendChild(mealEl);

    //show the popup meal-info
    mealPopup.classList.remove('hidden')
}

mealPopupBtn.addEventListener('click', () => {
    mealPopup.style.opacity = 0;
    mealPopup.classList.add('hidden');
})
 
