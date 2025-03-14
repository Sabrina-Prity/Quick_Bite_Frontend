const fetchDistrict = () => {
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
    fetchDistrict();
});

const fetchSellerDetail = async () => {
    const seller_id = localStorage.getItem('seller_id');
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-details-update/${seller_id}/`, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const seller = await response.json();
            // Fix the image URL
        let imageUrl = seller?.image;
        
        // Remove incorrect "image/upload/" prefix if it exists
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        // Ensure the image URL is properly formatted
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }
            const sellerDetailsDiv = document.getElementById('seller-details');
            sellerDetailsDiv.innerHTML = `
                <div class="seller-card">
                    <div class="seller-info">
                        <img src="${imageUrl}" alt="Seller Image" class="seller-image">
                        <div class="seller-details">
                            <h2>Details</h2>
                            <p><strong>Company Name:</strong> ${seller.company_name}</p>
                            <p><strong>Business Number:</strong> ${seller.mobile_no}</p>
                            <p><strong>Postal Code:</strong> ${seller.postal_code}</p>
                            <p><strong>Street Name:</strong> ${seller.street_name}</p>
                            <p><strong>District:</strong> ${seller.district}</p>
                            <button id="edit-profile-btn" class="btn">Edit Profile</button>
                        </div>
                    </div>
                </div>
            `;

            // Populate the form fields with the seller's existing data
            document.getElementById('mobile_no').value = seller.mobile_no;
            document.getElementById('company_name').value = seller.company_name;
            document.getElementById('street_name').value = seller.street_name;
            document.getElementById('postal_code').value = seller.postal_code;
            document.getElementById('district').value = seller.district;

            // Attach the event listener after the element is rendered
            const editButton = document.getElementById('edit-profile-btn');
            if (editButton) {
                editButton.addEventListener('click', () => {
                    document.getElementById('edit-profile-form').style.display = 'block';
                });
            } else {
                console.error("Edit profile button not found!");
            }
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail || 'Seller not found'}`);
        }
    } catch (error) {
        console.error('Error fetching seller details:', error);
        // alert('Error fetching seller details. Please try again later.');
    }
};


const updateSellerDetail = async (event) => {
    event.preventDefault();

    const seller_id = localStorage.getItem("seller_id");
    const token = localStorage.getItem('token');

    const mobile_no = document.getElementById('mobile_no').value;
    const company_name = document.getElementById('company_name').value;
    const street_name = document.getElementById('street_name').value;
    const postal_code = document.getElementById('postal_code').value;
    const district = document.getElementById('district').value;
    const imageInput = document.getElementById('image').files[0];

    if (!imageInput) {
        document.getElementById('error').innerText = 'Please upload an image.';
        return;
    }

    document.getElementById('error').innerText = '';

    // Upload image to Cloudinary
    const formData = new FormData();
    formData.append("file", imageInput);  // Use 'file' for key
    formData.append("upload_preset", "ecommerce_upload");  // Your upload preset

    try {
        const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dtyxxpqdl/image/upload', {
            method: 'POST',
            body: formData,  // Automatically sets the right Content-Type
        });

        const uploadData = await uploadResponse.json();

        // Log the response to inspect errors
        console.log(uploadData);

        if (uploadData && uploadData.secure_url) {  // Check if URL exists
            const imageUrl = uploadData.secure_url;

            // Prepare seller update data
            const info = {
                mobile_no: mobile_no,
                image: imageUrl,
                company_name: company_name,
                street_name: street_name,
                postal_code: postal_code,
                district: district,
            };

            // Update seller profile
            const response = await fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-details-update/${seller_id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(info),
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                fetchSellerDetail();
                document.getElementById('edit-profile-form').style.display = 'none';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.detail || 'Could not update profile'}`);
            }
        } else {
            document.getElementById('error').innerText = 'Image upload failed. Please try again.';
        }
    } catch (error) {
        console.error('Error updating seller details:', error);
        alert('Error updating seller details. Please try again later.');
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('update-profile-form');
    if (updateForm) {
        updateForm.addEventListener('submit', updateSellerDetail);
    } else {
        console.error("Update profile form not found!");
    }
    fetchSellerDetail();
});