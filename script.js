document.addEventListener("DOMContentLoaded", () => {
  const cartItemsContainer = document.querySelector(".cart-items tbody");
  const subtotalValueElement = document.querySelector(".subtotal-value");
  const totalValueElement = document.querySelector(".total-value");

  fetch(
    "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
  )
    .then((response) => response.json())
    .then((data) => {
      cartItemsContainer.innerHTML = "";

      data.items.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>
              <img src="${item.image}" alt="${item.name}" />
              <span>${item.title}</span>
            </td>
            <td>Rs. ${item.price ? item.price.toFixed(2) : "0.00"}</td>
            <td>
              <input type="number" value="${
                item.quantity
              }" min="1" class="quantity-input" />
            </td>
            <td class="subtotal">Rs. ${
              item.price && item.quantity
                ? (item.price * item.quantity).toFixed(2)
                : "0.00"
            }</td>
            <td><button class="delete-btn">🗑</button></td>
          `;
        cartItemsContainer.appendChild(row);
      });

      attachListeners();
      updateTotals();
    })
    .catch((error) => console.error("Error fetching cart data:", error));

  function attachListeners() {
    const quantityInputs = document.querySelectorAll(".quantity-input");
    const deleteButtons = document.querySelectorAll(".delete-btn");

    quantityInputs.forEach((input) => {
      input.addEventListener("input", () => {
        updateSubtotal(input);
        updateTotals();
      });
    });

    deleteButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const row = button.closest("tr");
        row.remove();
        updateTotals();
      });
    });
  }

  function updateSubtotal(input) {
    const row = input.closest("tr");
    let price = parseFloat(
      row.querySelector("td:nth-child(2)").textContent.replace("Rs. ", "")
    );

    if (isNaN(price)) {
      price = 0;
    }

    const quantity = parseInt(input.value);
    const subtotalElement = row.querySelector(".subtotal");
    const newSubtotal = price * quantity || 0;
    subtotalElement.textContent = `Rs. ${newSubtotal.toFixed(2)}`;
  }

  function updateTotals() {
    let total = 0;
    const subtotals = document.querySelectorAll(".subtotal");

    subtotals.forEach((subtotal) => {
      let subtotalValue = parseFloat(subtotal.textContent.replace("Rs. ", ""));

      if (isNaN(subtotalValue)) {
        subtotalValue = 0;
      }

      total += subtotalValue;
    });

    subtotalValueElement.textContent = `Rs. ${total.toFixed(2)}`;
    totalValueElement.textContent = `Rs. ${total.toFixed(2)}`;
  }
});
