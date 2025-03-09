const fetchDistricts = () => {
    const districtSelect = document.getElementById("district");
    if (!districtSelect) {
        console.error("Element with ID 'district' not found!");
        return;
    }

    fetch("https://quick-bite-backend-pink.vercel.app/seller/districts/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log("district", data)
        districtSelect.innerHTML = '<option value="" selected disabled>Select District</option>';

        const districts = data.districts;
        districts.forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            districtSelect.appendChild(option);
        });
    })
    .catch((error) => {
        console.error("Error fetching districts:", error.message);
    });
};

document.addEventListener("DOMContentLoaded", () => {
    fetchDistricts();
});




const sellerRegistration = (event) => {
    event.preventDefault();

    const username = getValue("username");
    const first_name = getValue("first_name");
    const last_name = getValue("last_name");
    const email = getValue("email");
    const password = getValue("password");
    const confirm_password = getValue("confirm_password");
    const company_name = getValue("company_name"); 
    const street_name = getValue("street_name"); 
    const postal_code = getValue("postal_code"); 
    const district = getValue("district"); 
    console.log(district)
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

    const formData = new FormData();
    formData.append("file", imageInput); // Use 'file' instead of 'image' as the key
    formData.append("upload_preset", "ecommerce_upload"); // Replace with your upload preset

    // Upload image to Cloudinary
    fetch("https://api.cloudinary.com/v1_1/dtyxxpqdl/image/upload", {  // Replace with your cloud name
        method: "POST",
        body: formData,
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.secure_url) { 
            const imageUrl = data.secure_url; 
            console.log("Image uploaded successfully:", imageUrl);

            const info = {
                username,
                first_name,
                last_name,
                email,
                password,
                confirm_password,
                company_name, 
                mobile_no,
                street_name,
                postal_code,
                district,
                image: imageUrl,
            };
            console.log("Info", info)

            fetch("https://quick-bite-backend-pink.vercel.app/seller/register/", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json" },
                body: JSON.stringify(info),
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    document.getElementById("error").innerText = data.error;
                } else {
                    localStorage.setItem('seller_id', data.seller_id);
                    console.log("Registration successful:", data);
                    document.getElementById("error").innerText =
                        "Registration successful! A confirmation email has been sent to your email address.";
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

const sellerLogin = async (event) => {
    event.preventDefault();
    const username = getValue("login-username");
    const password = getValue("login-password");

    if (username && password) {
        try {
            // Fetch the list of sellers
            const sellerListResponse = await fetch("https://quick-bite-backend-pink.vercel.app/seller/seller-list/");
            if (!sellerListResponse.ok) {
                throw new Error("Failed to fetch seller list.");
            }

            const sellerList = await sellerListResponse.json();

            // Check if the username exists in the seller list
            const seller = sellerList.find((s) => s.user === username);
            if (!seller) {
                throw new Error("This username does not belong to a seller.");
            }

            // Proceed with login if the username exists in the seller list
            const loginResponse = await fetch("https://quick-bite-backend-pink.vercel.app/seller/login/", {
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

            const data = await loginResponse.json();

            if (data.token && data.user_id) {
                alert("Login Successful");
                localStorage.setItem("token", data.token);
                localStorage.setItem("user_id", data.user_id);
                localStorage.setItem("seller_id", data.seller_id);
                localStorage.setItem("is_admin", data.is_admin);
                loadcartId().then(() => {
                    window.location.href = "index.html"; // Redirect after cartId is loaded
                });
            }
        } catch (error) {
            console.error("Login error:", error.message);
            alert(error.message || "An error occurred. Please try again.");
        }
    } else {
        alert("Please enter both username and password.");
    }
};




const loadcartId = () => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //     alert("Please login");
    //     return;
    // }
    fetch(`https://quick-bite-backend-pink.vercel.app/cart/cart-details/${localStorage.getItem("user_id")}/`,{
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((res) => res.json())
        .then((data) => {
            console.log("Cart Data", data)
            const cartId = data.id;
            localStorage.setItem("cartId", cartId); 
        });
};





const handlelogOut = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    fetch("https://quick-bite-backend-pink.vercel.app/seller/logout", {
        method: "GET",
        headers: {
            Authorization: `Token ${token}`,
        },
    })
        .then((res) => {
            // console.log("Logout successful");
            localStorage.removeItem("cartId");
            localStorage.removeItem("token");
            localStorage.removeItem("user_id");
            localStorage.removeItem("seller_id");
            // localStorage.removeItem("username");
            localStorage.removeItem("is_admin");
            alert("Logout Successful");
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error("Error during logout:", error);
            alert("Logout failed. Please try again.");
        });
};

