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
            // Step 1: Attempt admin login first
            const adminLoginResponse = await fetch("https://quick-bite-backend-pink.vercel.app/customer/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (adminLoginResponse.ok) {
                const adminData = await adminLoginResponse.json();
                if (adminData.token && adminData.is_admin) {
                    alert("Admin Login Successful");
                    localStorage.setItem("token", adminData.token);
                    localStorage.setItem("user_id", adminData.user_id);
                    localStorage.setItem("is_admin", true);
                    window.location.href = "index.html"; 
                    return; 
                }
            }

            // Step 2: If not an admin, proceed to check if the user is a customer
            const customerListResponse = await fetch("https://quick-bite-backend-pink.vercel.app/customer/customer-list/");
            if (!customerListResponse.ok) {
                throw new Error("Failed to fetch customer list.");
            }

            const customerList = await customerListResponse.json();
            const customer = customerList.find((s) => s.user === username);

            if (!customer) {
                throw new Error("This username does not belong to a customer.");
            }

            // Step 3: Login as a customer
            const customerLoginResponse = await fetch("https://quick-bite-backend-pink.vercel.app/customer/login/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!customerLoginResponse.ok) {
                const errorData = await customerLoginResponse.json();
                throw new Error(errorData.detail || "Customer login failed.");
            }

            const customerData = await customerLoginResponse.json();
            if (customerData.token && customerData.user_id) {
                alert("Customer Login Successful");
                localStorage.setItem("token", customerData.token);
                localStorage.setItem("user_id", customerData.user_id);
                localStorage.setItem("is_admin", false);
                window.location.href = "index.html";
            }
        } catch (error) {
            console.error("Login error:", error.message);
            alert(error.message || "An error occurred. Please try again.");
        }
    } else {
        alert("Please enter both username and password.");
    }
};
