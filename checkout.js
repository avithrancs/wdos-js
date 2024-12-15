// Fetch the saved order from localStorage and display it
const order = JSON.parse(localStorage.getItem("currentOrder"));
const orderItems = document.getElementById("order-items");
const totalPriceElement = document.getElementById("total-price");
let total = 0;

// Display the order summary if the order exists
if (order && order.length > 0) {
    order.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>LKR ${item.price.toFixed(2)}</td>
            <td>LKR ${(item.price * item.quantity).toFixed(2)}</td>
        `;
        orderItems.appendChild(row);
    });

    // Calculate total price
    total = order.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Add a Total Price row at the end of the table
    const totalRow = document.createElement("tr");
    totalRow.innerHTML = `
        <td colspan="3" style="text-align: right;"><strong>Total Price:</strong></td>
        <td><strong>LKR ${total.toFixed(2)}</strong></td>
    `;
    orderItems.appendChild(totalRow);
} else {
    alert("Your cart is empty. Please add items to your cart first.");
    window.location.href = "order.html"; // Redirect back to order page
}

// Show or hide credit card details fields based on payment method
const paymentMethodSelect = document.getElementById("payment-method");
const creditCardDetails = document.getElementById("credit-card-details");

paymentMethodSelect.addEventListener("change", () => {
    if (paymentMethodSelect.value === "credit-card") {
        creditCardDetails.style.display = "block";
    } else {
        creditCardDetails.style.display = "none";
    }
});

// Handle Pay button click
const payButton = document.getElementById("pay-button");
payButton.addEventListener("click", handlePayment);

function handlePayment() {
    const name = document.getElementById("name").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = paymentMethodSelect.value;

    // Validation for mandatory fields
    if (!name) {
        alert("Please enter your name.");
        return;
    }
    if (!address) {
        alert("Please enter your address.");
        return;
    }
    if (!paymentMethod) {
        alert("Please select a payment method.");
        return;
    }

    // Validate credit card fields if Credit Card is selected
    if (paymentMethod === "credit-card") {
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value.trim();

        if (!cardNumber || !expiryDate || !cvv) {
            alert("Please fill out all credit card details.");
            return;
        }
        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            alert("Invalid card number. Please enter a valid 16-digit number.");
            return;
        }
        if (!expiryDate.match(/^\d{4}-\d{2}$/)) { // Ensures format YYYY-MM
            alert("Invalid expiry date format. Please use YYYY-MM.");
            return;
        }
        if (cvv.length !== 3 || isNaN(cvv)) {
            alert("Invalid CVV. Please enter a valid 3-digit CVV.");
            return;
        }
    }

    // Proceed with payment
    finalizeOrder(name, address);
}

function finalizeOrder(name, address) {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3); // Add 3 days for delivery

    document.getElementById("thank-you-message").textContent = `Thank you for your purchase, ${name}! Your order will be delivered to ${address} by ${deliveryDate.toDateString()}.`;
    document.getElementById("thank-you-message").style.display = "block";

    // Clear localStorage and form after order completion
    localStorage.removeItem("currentOrder");
    document.getElementById("checkout-form").reset();
    creditCardDetails.style.display = "none"; // Hide credit card fields after form reset
}
