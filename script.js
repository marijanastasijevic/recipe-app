const meals = document.getElementById('meals')

async function getRandomMeal(){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")

    const respData = await response.json();
    const randomMeal = respData.meals[0]

    console.log(randomMeal);

    addMeal(randomMeal, true)
    
}

async function getMealById(id){
    const meal = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id)
}

async function getMealsBySearch(name){
   const meal = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+name)
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
    
    meals.appendChild(meal);

    const btn =  meal.querySelector('.meal-body .fav-btn');

    btn.addEventListener('click', () => {
        if(btn.classList.contains('active')){
            removeMealLocalStorage(mealData.idMeal);
            btn.classList.remove('active')
        }
        else{
            addMealLocalStorage(mealData.idMeal);
            btn.classList.add('active')
        }
        btn.classList.toggle('active');
        
    })
}

function addMealLocalStorage(mealId){
    const mealIds = getMealsLocalStorage()
    localStorage.setItem('mealIds', JSON.stringify([...mealIds, mealId]))

}

function removeMealLocalStorage(){
    const mealIds = getMealById();

    localStorage.setItem('mealIds',JSON.stringify(mealIds.filter(id => id !== mealId)))
}

function getMealsLocalStorage(){
    const mealIds = localStorage.getItem('mealIds');

    return mealIds === null ? [] : mealIds;
}
 
getRandomMeal()