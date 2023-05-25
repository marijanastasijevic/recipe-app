async function getRandomMeal(){
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")

    const respData = await response.json();
    const randomMeal = respData.meals[0]

    console.log(randomMeal);
    
}

async function getMealById(id){
    const meal = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id)
}

async function getMealsBySearch(name){
   const meal = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+name)
}

getRandomMeal()