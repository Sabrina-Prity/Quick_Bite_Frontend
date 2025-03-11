fetch("nav_bar.html")
  .then((res) => res.text())
  .then((data) => {
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.innerHTML = data;

    const token = localStorage.getItem("token");
    const isSeller = localStorage.getItem("seller_id");
    const isAdmin = localStorage.getItem("is_admin") === "true";

    const userContainer = document.getElementById("user-container");
    const businessSection = document.getElementById("business-section");

    if (token && businessSection) {
      businessSection.style.padding = "0";
      businessSection.style.margin = "0";
      businessSection.remove(); // Only remove it after setting styles
    }
    // Dynamically update Navbar links
    if (token) {
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Home</a></li>
      `;

      if (isSeller) {
        userContainer.innerHTML += `
          <li class="nav-item" id="profile-item"><a class="nav-link" href="seller_profile.html">Profile</a></li>
        `;
      }

      if (!isSeller && !isAdmin) {
        userContainer.innerHTML += `
          <li class="nav-item btn-cart"><a class="nav-link" href="cart.html">Cart <i class="fa-solid fa-cart-shopping"></i></a></li>
          <li class="nav-item" id="profile-item"><a class="nav-link" href="customer_profile.html">Profile</a></li>
          <li class="nav-item" id="profile-item"><a class="nav-link" href="customer_orders.html">Order History</a></li>
        `;
      }

      userContainer.innerHTML += `
        <li class="nav-item"><a href="#" onclick="handlelogOut(event)" class="nav-link">Logout</a></li>
      `;

      if (isSeller) {
        userContainer.innerHTML += `
          <li class="nav-item"><a class="nav-link" href="all_reviews.html">Reviews</a></li>
          <li class="nav-item"><a class="nav-link" href="all_orders.html">Orders</a></li>
          <li class="nav-item"><a class="nav-link" href="add_menu.html">Add Menu</a></li>
          <li class="nav-item"><a class="nav-link" href="add_item.html">Add Item</a></li>
        `;
      }

      if (isAdmin) {
        userContainer.innerHTML += `
          <li class="nav-item"><a class="nav-link" href="avg_ratings.html">Ratings</a></li>
          <li class="nav-item"><a class="nav-link" href="all_seller.html">All Sellers</a></li>
          <li class="nav-item"><a class="nav-link" href="all_customer.html">All Customers</a></li>
        `;
      }
    } else {
      // Default for unauthenticated users
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="customer_login.html">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="customer_register.html">Register</a></li>
      `;

      // Default Business Section for unauthenticated users
      if (businessSection) {
        businessSection.innerHTML = `
          <button class="close-btn" onclick="removeBusinessSection()">×</button>
          <h1>For Business Account</h1>
          <ul class="option flex">
            <li class="nav-item"><a class="nav-link" href="seller_register.html">Register</a></li>
            <li class="nav-item"><a class="nav-link" href="seller_login.html">Login</a></li>
          </ul>
        `;
      }
    }
  })
  .catch((err) => {
    console.error("Error loading navbar:", err);
  });

function removeBusinessSection() {
  const section = document.getElementById("business-section");
  section.style.display = "none";
  // if (section) {
  //   section.remove(); // Fully removes the section from the DOM
  // }
}
