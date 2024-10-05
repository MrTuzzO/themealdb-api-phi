function search() {
    let searchBox = document.getElementById("Search_box");
    let search = searchBox.value;
    let cardHolder = document.getElementById("card-holder");
    cardHolder.innerHTML = "";

    if (search === "") {
        cardHolder.innerHTML = `
            <p class="text-center fs-1 text-warning">Please enter a search term</p>
        `;
        return;
    }

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`)
        .then(res => res.json())
        .then(data => {
            const SerachRes = data.meals;
            if (SerachRes == null) {
                cardHolder.innerHTML = `
                    <p class="text-center fs-1 text-warning">Not found</p>
                `;
            } else {
                for (let listItem of SerachRes) {
                    let ingredients = [];
                    for (let i = 1; i <= 20; i++) {
                        let ingredient = listItem[`strIngredient${i}`];
                        let measure = listItem[`strMeasure${i}`];
                        if (ingredient && ingredient.trim()) {
                            ingredients.push(`${measure} ${ingredient}`);
                        }
                    }
                    let ingredientsList = ingredients.join(", ");

                    let div = document.createElement("div");
                    div.classList.add("col-lg-3", "col-md-4", "col");
                    div.innerHTML = `
                    <div class="card" style="width: 18rem;">
                        <img src="${listItem.strMealThumb}" class="card-img-top">
                        <div class="card-body">
                            <h5 class="card-title">${listItem.strMeal}</h5>
                            <a href="#" class="btn btn-primary" onclick="showDetails('${listItem.strMealThumb}','${listItem.strMeal}', '${listItem.strCategory}', '${ingredientsList}')" data-bs-toggle="modal">Show Details</a>
                        </div>
                    </div>
                `;
                    cardHolder.appendChild(div);
                }
            }
        });

    searchBox.value = "";
}


function showDetails(img, name, category, ingredients) {
    document.getElementById("mealImage").src = img;

    document.getElementById("mealName").innerText = name;
    document.getElementById("mealCategory").innerText = category;

    const ingredientsList = document.getElementById("mealIngredients");
    ingredientsList.innerHTML = "";

    ingredients.split(", ").forEach(ingredient => {
        let li = document.createElement("li");
        li.innerText = ingredient;
        ingredientsList.appendChild(li);
    });

    let mealModal = new bootstrap.Modal(document.getElementById('mealModal'));
    mealModal.show();
}
