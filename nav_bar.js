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

    // Apply negative margin only if the user has a token
    if (token) {
      navbarContainer.style.marginBottom = "-20px";
    }

    // Check if we are on the home page
    const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/";

    if (token && businessSection) {
      businessSection.style.padding = "0";
      businessSection.style.margin = "0";
      businessSection.remove();
    }

    // Dynamically update Navbar links
    if (token) {
      userContainer.innerHTML = `
        <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
        <li class="nav-item" id="mango-item"><a class="nav-link" href="product.html">Product</a></li>
      `;

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
          <li class="nav-item"><a class="nav-link" href="seller_dashboard.html">Dashboard</a></li>
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
        <li class="nav-item"><a class="nav-link active" href="index.html">Home</a></li>
        <li class="nav-item" id="mango-item"><a class="nav-link" href="product.html">Product</a></li>
        <li class="nav-item"><a class="nav-link" href="customer_login.html">Login</a></li>
        <li class="nav-item"><a class="nav-link" href="customer_register.html">Register</a></li>
      `;

      // Business Section for unauthenticated users
      if (isHomePage && businessSection) {
        businessSection.innerHTML = `
          <button class="close-btn" onclick="removeBusinessSection()">×</button>
          <h1>For Business Account</h1>
          <ul class="option flex">
            <li class="nav-item"><a class="nav-link" href="seller_register.html">Register</a></li>
            <li class="nav-item"><a class="nav-link" href="seller_login.html">Login</a></li>
          </ul>
        `;
      } else if (!isHomePage && businessSection) {
        businessSection.remove();
      }
    }
  })
  .catch((err) => {
    console.error("Error loading navbar:", err);
  });
