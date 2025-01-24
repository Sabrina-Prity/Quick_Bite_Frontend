
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
    console.log("Image",imageInput)
    
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
    formData.append("image", imageInput);

    // Upload image to ImageBB
    fetch("https://api.imgbb.com/1/upload?key=13f268ce593eb3a2e14811c1e1de5660", {
        method: "POST",
        body: formData,
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                const imageUrl = data.data.url; 
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
                console.log("Customer Info", info)

                fetch("http://127.0.0.1:8000/customer/register/", {
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
                            document.getElementById("error").innerText ="Registration successful!";
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



const customerLogin =async (event) => {
        event.preventDefault();
        const username = getValue("login-username");
        const password = getValue("login-password");
    
        if (username && password) {
            try {
    
                const customerListResponse = await fetch("http://127.0.0.1:8000/customer/customer-list/");
                if (!customerListResponse.ok) {
                    throw new Error("Failed to fetch customer list.");
                }
    
                const customerList = await customerListResponse.json();
    
                const customer = customerList.find((s) => s.user === username);
                if (!customer) {
                    throw new Error("This username does not belong to a customer.");
                }
    
                // Proceed with login if the username exists in the customer list
                const loginResponse = await fetch("http://127.0.0.1:8000/customer/login/", {
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
                    localStorage.setItem("is_admin", data.is_admin);
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
