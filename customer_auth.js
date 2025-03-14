const customerRegistration = (event) => {
    event.preventDefault();

    const username = getValue("username");
    const first_name = getValue("first_name");
    const last_name = getValue("last_name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
    const mobile_no = getValue("mobile_no");

    const imageInput = document.getElementById("image").files[0];
    console.log("Image", imageInput);
    
    if (!imageInput) {
        document.getElementById("error").innerText = "Please upload an image.";
        return;
    }
    
    if (password !== confirm_password) {
        document.getElementById("error").innerText = "Password and Confirm Password do not match.";
        return;
    }

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
        document.getElementById("error").innerText = "Password must contain at least eight characters, one letter, one number, and one special character.";
        return;
    }

    // Create form data to upload the image to Cloudinary
    const formData = new FormData();
    formData.append("file", imageInput);  // Use 'file' for the key
    formData.append("upload_preset", "ecommerce_upload");  // Your Cloudinary upload preset

    // Upload image to Cloudinary
    fetch("https://api.cloudinary.com/v1_1/dtyxxpqdl/image/upload", { // Replace 'your_cloud_name' with your actual Cloudinary cloud name
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.secure_url) { // Check if the upload is successful
                const imageUrl = data.secure_url;
                console.log("Image uploaded successfully:", imageUrl);

                const info = {
                    image: imageUrl,
                    mobile_no,
                    username,
                    first_name,
                    last_name,
                    email,
                    password,
                    confirm_password,
                };
                console.log("Customer Info", info);

                fetch("https://quick-bite-backend-pink.vercel.app/customer/register/", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json" 
                    },
                    body: JSON.stringify(info),
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.error) {
                            document.getElementById("error").innerText = data.error;
                        } else {
                            document.getElementById("error").innerText = "Registration successful!";
                        }
                    })
                    .catch((error) => {
                        console.error("Error during registration:", error);
                        document.getElementById("error").innerText = "Error during registration. Please try again.";
                    });
            } else {
                console.error("Image upload failed:", data);
                document.getElementById("error").innerText = "Image upload failed. Please try again.";
            }
        })
        .catch((error) => {
            console.error("Error during image upload:", error);
            document.getElementById("error").innerText = "Error during image upload. Please check your connection.";
        });
};





const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
};



const customerLogin = async (event) => {
    event.preventDefault();

    const username = getValue("login-username");
    const password = getValue("login-password");

    if (username && password) {
        try {
            // Step 1: Attempt login
            const loginResponse = await fetch("https://quick-bite-backend-pink.vercel.app/customer/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!loginResponse.ok) {
                const errorData = await loginResponse.json();
                throw new Error(errorData.detail || "Login failed.");
            }

            const userData = await loginResponse.json();
            if (!userData.token || !userData.user_id) {
                throw new Error("Invalid login response.");
            }

            localStorage.setItem("token", userData.token);
            localStorage.setItem("user_id", userData.user_id);
            localStorage.setItem("is_admin", userData.is_admin || false);

            alert(userData.is_admin ? "Admin Login Successful" : "Customer Login Successful");

            // Redirect based on user type
            if (userData.is_admin) {
                window.location.href = "dashboard.html"; // Redirect admin to dashboard
            } else {
                try {
                    await loadcartId(); // Load cart for customers
                } catch (error) {
                    console.error("Error loading cart:", error);
                }
                window.location.href = "product.html"; // Redirect customer to homepage
            }

        } catch (error) {
            console.error("Login error:", error.message);
            alert(error.message || "An error occurred. Please try again.");
        }
    } else {
        alert("Please enter both username and password.");
    }
};


// Function to load cart ID
const loadcartId = () => {
    return new Promise((resolve, reject) => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");

        if (!token || !userId) {
            console.log("User is not logged in, cannot load cart ID.");
            return resolve();
        }

        fetch(`https://quick-bite-backend-pink.vercel.app/cart/cart-details/${userId}/`, {
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data && data.id) {
                localStorage.setItem("cartId", data.id);
                console.log("Cart ID loaded:", data.id);
            } else {
                console.log("No cart found for this user.");
            }
            resolve(); // Resolve after cart processing
        })
        .catch((error) => {
            console.error("Error loading cart ID:", error);
            reject(error); // Reject on error
        });
    });
};
