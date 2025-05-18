document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("calorie-form");
    const foodList = document.getElementById("food-list");
    const totalCalories = document.querySelector("#total-calories span");
    const resetButton = document.getElementById("reset-button");

    let foodItems = JSON.parse(document.cookie || "[]");

    function updateTotalCalories() {
        const total = foodItems.reduce((sum, item) => sum + item.calories, 0);
        totalCalories.textContent = total;
    }

    function updateCookie() {
        document.cookie = JSON.stringify(foodItems);
    }

    function renderList() {
        foodList.innerHTML = "";
        foodItems.forEach((item, index) => {
            const li = document.createElement("li");
            li.textContent = `${item.food}: ${item.calories} cal`;
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "X";
            deleteBtn.addEventListener("click", () => {
                foodItems.splice(index, 1);
                updateCookie();
                updateTotalCalories();
                renderList();
            });
            li.appendChild(deleteBtn);
            foodList.appendChild(li);
        });
        updateTotalCalories();
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const food = document.getElementById("food-name").value;
        const calories = Number(document.getElementById("calorie-count").value);
        foodItems.push({ food, calories });
        updateCookie();
        renderList();
        form.reset();
    });

    resetButton.addEventListener("click", () => {
        foodItems = [];
        updateCookie();
        renderList();
    });

    // **Fetching placeholder data**
    fetch("https://jsonplaceholder.typicode.com/posts/1")
        .then(response => response.json())
        .then(data => console.log("Placeholder data:", data));

    renderList();
});
