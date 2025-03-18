let cartItems = [];

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
                    div.classList.add("col-lg-4", "col-md-6", "col");
                    div.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${listItem.strMealThumb}" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title">${listItem.strMeal}</h5>
                            <button class="btn btn-success my-2" onclick="addToCart('${listItem.strMeal}')">Add to Cart</button>
                            <button class="btn btn-primary my-2" onclick="showDetails('${listItem.strMealThumb}','${listItem.strMeal}', '${listItem.strCategory}', '${ingredientsList}')" data-bs-toggle="modal">Show Details</button>
                        </div>
                    </div>
                `;
                    cardHolder.appendChild(div);
                }
            }
        });

    searchBox.value = "";
}

function addToCart(mealName) {
    if (cartItems.length >= 5) {
        alert("You can only add up to 5 items to the cart.");
        return;
    }
    if (!cartItems.includes(mealName)) {
        cartItems.push(mealName);
        updateCart();
    } else {
        alert("This item is already in the cart.");
    }
}

function updateCart() {
    let cartHolder = document.getElementById("cart-holder");
    let cartCount = document.getElementById("cart-count");

    cartHolder.innerHTML = cartItems.map(item => `<p class="border-bottom py-1">${item}</p>`).join("");
    cartCount.innerText = `(${cartItems.length})`;
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

function loadInitialMeals() {
    fetch("https://www.themealdb.com/api/json/v1/1/search.php?f=b")
        .then(res => res.json())
        .then(data => {
            const meals = data.meals.slice(0, 9);
            let cardHolder = document.getElementById("card-holder");
            cardHolder.innerHTML = "";

            meals.forEach(meal => {
                let ingredients = [];
                for (let i = 1; i <= 20; i++) {
                    let ingredient = meal[`strIngredient${i}`];
                    let measure = meal[`strMeasure${i}`];
                    if (ingredient && ingredient.trim()) {
                        ingredients.push(`${measure} ${ingredient}`);
                    }
                }
                let ingredientsList = ingredients.join(", ");

                let div = document.createElement("div");
                div.classList.add("col-lg-4", "col-md-6", "col");
                div.innerHTML = `
                    <div class="card h-100 shadow-sm">
                        <img src="${meal.strMealThumb}" class="card-img-top">
                        <div class="card-body text-center">
                            <h5 class="card-title">${meal.strMeal}</h5>
                            <button class="btn btn-success my-2" onclick="addToCart('${meal.strMeal}')">Add to Cart</button>
                            <button class="btn btn-primary my-2" onclick="showDetails('${meal.strMealThumb}','${meal.strMeal}', '${meal.strCategory}', '${ingredientsList}')" data-bs-toggle="modal">Show Details</button>
                        </div>
                    </div>
                `;
                cardHolder.appendChild(div);
            });
        });
}
window.onload = loadInitialMeals;
