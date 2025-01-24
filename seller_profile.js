const fetchDistrict = () => {
    const districtSelect = document.getElementById("district");
    if (!districtSelect) {
        console.error("Element with ID 'district' not found!");
        return;
    }

    fetch("http://127.0.0.1:8000/seller/districts/", {
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
        const response = await fetch(`http://127.0.0.1:8000/seller/seller-details-update/${seller_id}/`, {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const seller = await response.json();
            const sellerDetailsDiv = document.getElementById('seller-details');
            sellerDetailsDiv.innerHTML = `
                <div class="seller-card">
                    <div class="seller-info">
                        <img src="${seller.image}" alt="Seller Image" class="seller-image">
                        <div class="seller-details">
                            <h2>Seller Details</h2>
                            <p><strong>Company Name:</strong> ${seller.company_name}</p>
                            <p><strong>Business Number:</strong> ${seller.mobile_no}</p>
                            <p><strong>Postal Code:</strong> ${seller.postal_code}</p>
                            <p><strong>Street Name:</strong> ${seller.street_name}</p>
                            <p><strong>District:</strong> ${seller.district}</p>
                            <button id="edit-profile-btn" class="btn btn-primary">Edit Profile</button>
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

            // Attach event listener to the edit profile button after it has been rendered
            const editButton = document.getElementById('edit-profile-btn');
            editButton.addEventListener('click', () => {
                document.getElementById('edit-profile-form').style.display = 'block';
            });
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail || 'Seller not found'}`);
        }
    } catch (error) {
        console.error('Error fetching seller details:', error);
        alert('Error fetching seller details. Please try again later.');
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

    // Upload image to ImgBB
    const formData = new FormData();
    formData.append('image', imageInput);

    try {
        const uploadResponse = await fetch('https://api.imgbb.com/1/upload?key=13f268ce593eb3a2e14811c1e1de5660', {
            method: 'POST',
            body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
            const imageUrl = uploadData.data.url;

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
            const response = await fetch(`http://127.0.0.1:8000/seller/seller-details-update/${seller_id}/`, {
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

// Attach the form submission event listener on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('update-profile-form').addEventListener('submit', updateSellerDetail);
    fetchSellerDetail();
});
