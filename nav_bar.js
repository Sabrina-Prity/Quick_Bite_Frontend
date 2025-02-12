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

    // Dynamically update Navbar links
    if (token) {
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Home</a></li>
      `;

      // Add Profile section for non-admins
      if (isSeller) {
        userContainer.innerHTML += `
          <li class="nav-item" id="profile-item"><a class="nav-link" href="seller_profile.html">Profile</a></li>
        `;
      }

      // Add Cart section for regular users only (not sellers or admins)
      if (!isSeller && !isAdmin) {
        userContainer.innerHTML += `
          <li class="nav-item btn-cart"><a class="nav-link" href="cart.html">Cart <i class="fa-solid fa-cart-shopping"></i></a></li>
          <li class="nav-item" id="profile-item"><a class="nav-link" href="customer_profile.html">Profile</a></li>
          <li class="nav-item" id="profile-item"><a class="nav-link" href="customer_orders.html">Order History</a></li>
        `;
      }

      // Add Logout button
      userContainer.innerHTML += `
        <li class="nav-item"><a href="#" onclick="handlelogOut(event)" class="nav-link">Logout</a></li>
      `;

      // Add seller-specific links
      if (isSeller) {
        userContainer.innerHTML += `
          <li class="nav-item"><a class="nav-link" href="all_reviews.html">Reviews</a></li>
          <li class="nav-item"><a class="nav-link" href="all_orders.html">Orders</a></li>
          <li class="nav-item"><a class="nav-link" href="add_menu.html">Add Menu</a></li>
          <li class="nav-item"><a class="nav-link" href="add_item.html">Add Item</a></li>
        `;
      }

      // Add admin-specific links
      if (isAdmin) {
        userContainer.innerHTML += `
          <li class="nav-item"><a class="nav-link" href="avg_ratings.html">Ratings</a></li>
          <li class="nav-item"><a class="nav-link" href="all_seller.html">All Sellers</a></li>
          <li class="nav-item"><a class="nav-link" href="all_customer.html">All Customer</a></li>
        `;
      }
    } else {
      // Default for users without tokens
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" aria-current="page" href="index.html">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="customer_login.html">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="customer_register.html">Register</a></li>
      `;

      // Default Business Section for unauthenticated users
      businessSection.innerHTML = `
        <button class="close-btn" onclick="removeBusinessSection()">×</button>
        <h1>For Business Account</h1>
        <ul class="option flex">
          <li class="nav-item"><a class="nav-link" href="seller_register.html">Register</a></li>
          <li class="nav-item"><a class="nav-link" href="seller_login.html">Login</a></li>
        </ul>
      `;
    }
  })
  .catch((err) => {
    console.error("Error loading navbar:", err);
  });


function removeBusinessSection() {
  const section = document.getElementById("business-section");
  section.style.display = "none";
}
