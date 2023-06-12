const meals = document.getElementById('meals');
const favoriteContainer = document.getElementById("fav-meals");
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

async function getMealsBySearch(name){
   const resp = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+name)


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
        //btn.classList.toggle('active');

    })

    meals.appendChild(meal);
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
        <li>
            <img 
                src="${mealData.strMealThumb}" 
                alt="${mealData.strMeal}"
            />
            <span>${mealData.strMeal}</span>
        </li>
    `

    
    favoriteContainer.appendChild(favMeal);
}


 
