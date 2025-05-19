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
            item.food = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            li.textContent = `${item.food}: ${item.calories} cal`;
            li.classList.add("item_food");
            li.style.color = item.calories > 500 ? "red" : "green";
            li.style.backgroundColor = item.calories > 500 ? "#ffcccc" : "#ccffcc";
            li.style.transition = "background-color 0.3s ease";
            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
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
        getCaloriesCount(food)
            .then(data => { while (data.length > 0) {
                console.log(data[0]);
                foodItems.push(data[0]);
                data.shift();
            }
            })
            .then(() => {
                updateCookie();
                renderList();
            })
            .catch(error => console.error('Fetch failed:', error));
    });

    resetButton.addEventListener("click", () => {
        foodItems = [];
        updateCookie();
        renderList();
    });


    function getCaloriesCount(food) {
        let url = 'https://api.calorieninjas.com/v1/nutrition?query=' + encodeURIComponent(food);

        return fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': '9MXf7NQhjWLR1MffoJ3VWQ==vYFeX5QKcVvPyWU3',
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            return result.items.map(item => ({
                name: item.name,
                calories: item.calories
            }));
        })
        .catch(error => {
            console.error('Error:', error);
            return []; // Returning an empty array if an error occurs
        });
       
    }
    renderList();
});
