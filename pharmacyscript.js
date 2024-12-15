// Fetch Medicines Data from JSON
fetch('pharmacy.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to load medicines data.");
        }
        return response.json();
    })
    .then(medicines => {
        displayMedicines(medicines);
    })
    .catch(error => console.error("Error:", error));

// Function to Display Medicines
function displayMedicines(medicines) {
    const medicineSection = document.getElementById("medicine-section");

    medicines.forEach(medicine => {
        const medicineCard = document.createElement("div");
        medicineCard.classList.add("medicine-card");
        medicineCard.innerHTML = `
            <img src="${medicine.img}" alt="${medicine.name}">
            <h3>${medicine.name}</h3>
            <p>Category: ${medicine.category}</p>
            <p>Price: LKR ${medicine.price}</p>
            <input type="number" min="0" step="1" value="0" class="quantity-input">
            <button data-name="${medicine.name}" data-price="${medicine.price}" class="add-to-order">Add to Order</button>
        `;
        medicineSection.appendChild(medicineCard);
    });

    // Attach event listeners to "Add to Order" buttons
    const handleAddToOrder = (event) => {
        const button = event.target;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        const quantityInput = button.previousElementSibling;
        let quantity = parseFloat(quantityInput.value);

        // Error handling for quantity
        if (isNaN(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity greater than 0.");
            return;
        }

        // Round up any fractional quantities
        quantity = Math.ceil(quantity);

        addToOrder(name, price, quantity);

        // Reset the input field to 0 after adding
        quantityInput.value = "0";
    };

    document.querySelectorAll(".add-to-order").forEach(button => {
        button.addEventListener("click", handleAddToOrder);
    });
}

// Order Management Logic
let order = [];
let total = 0;

// Function to add an item to the order
function addToOrder(name, price, quantity) {
    const existingItem = order.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        order.push({ name, price, quantity });
    }
    updateOrderTable();
}

// Function to update the order table
function updateOrderTable() {
    const orderItems = document.getElementById("order-items");
    const totalPriceElement = document.getElementById("total-price");

    orderItems.innerHTML = ""; // Clear the table before updating

    order.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>LKR ${item.price.toFixed(2)}</td>
            <td>LKR ${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="add-item-btn" data-index="${index}">+</button>
                <button class="subtract-item-btn" data-index="${index}">-</button>
            </td>
        `;
        orderItems.appendChild(row);
    });

    total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `$${total.toFixed(2)}`;

    // Attach event listeners to "Add" and "Subtract" buttons
    document.querySelectorAll(".add-item-btn").forEach(button => {
        button.addEventListener("click", handleAddItem);
    });

    document.querySelectorAll(".subtract-item-btn").forEach(button => {
        button.addEventListener("click", handleSubtractItem);
    });
}

// Add Item Function
function handleAddItem(event) {
    const index = parseInt(event.target.dataset.index);
    if (!isNaN(index) && index >= 0 && index < order.length) {
        order[index].quantity += 1; // Increase the quantity of the selected item
        updateOrderTable(); // Update the UI
    }
}

// Subtract Item Function
function handleSubtractItem(event) {
    const index = parseInt(event.target.dataset.index);
    if (!isNaN(index) && index >= 0 && index < order.length) {
        if (order[index].quantity > 1) {
            order[index].quantity -= 1; // Decrease the quantity if greater than 1
        } else {
            if (confirm(`Remove ${order[index].name} from your order?`)) {
                order.splice(index, 1); // Remove the item completely if quantity reaches 0
            }
        }
        updateOrderTable(); // Update the UI
    }
}

// Add to Favourites
document.getElementById("save-favorites").addEventListener("click", saveFavAction);

function saveFavAction() {
    if (order.length > 0) {
        localStorage.setItem("favouriteOrder", JSON.stringify(order));
        alert("Order saved as favourites!");
    } else {
        alert("Your order is empty! Add items to your order first.");
    }
}

// Apply Favourites
document.getElementById("apply-favorites").addEventListener("click", applyFavoritesAction);

function applyFavoritesAction() {
    const favourites = JSON.parse(localStorage.getItem("favouriteOrder"));
    if (favourites && favourites.length > 0) {
        order = favourites;
        updateOrderTable();
        alert("Favourites applied to your order!");
    } else {
        alert("No favourites found or favourites are empty.");
    }
}

// Buy Now
document.getElementById("buy-now").addEventListener("click", buyNowAction);

function buyNowAction() {
    if (order.length > 0) {
        localStorage.setItem("currentOrder", JSON.stringify(order));
        window.location.href = "checkout.html";
    } else {
        alert("Your order is empty! Add items to your order first.");
    }
}

// Clear Cart
document.getElementById("clear-cart").addEventListener("click", clearCartAction);

function clearCartAction() {
    if (order.length > 0) {
        if (confirm("Are you sure you want to clear the cart?")) {
            order = []; // Clear the order array
            total = 0; // Reset total
            updateOrderTable(); // Update the UI
            alert("Your cart has been cleared.");
        }
    } else {
        alert("Your cart is already empty.");
    }
}
