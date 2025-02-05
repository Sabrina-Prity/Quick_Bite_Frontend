const fetchCustomerDetails = async () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/customer/customer-detail/${user_id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const customer = await response.json();
        const customerDetailsDiv = document.getElementById('customer-details');

        // Fix the image URL
        let imageUrl = customer?.image;
        
        // Remove incorrect "image/upload/" prefix if it exists
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        // Ensure the image URL is properly formatted
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }

        customerDetailsDiv.innerHTML = `
          <div class="customer-card">
            <img src="${imageUrl}" alt="Customer Image" class="customer-image">
            <h2>Customer Details</h2>
            <p><strong>Username:</strong> ${customer.user}</p>
            <p><strong>Mobile Number:</strong> ${customer.mobile_no}</p>
            <button id="edit-profile-btn" class="btn btn-primary">Edit Profile</button>
          </div>
        `;

        document.getElementById('username').value = customer.user;
        document.getElementById('mobile_no').value = customer.mobile_no;

        document.getElementById('edit-profile-btn').addEventListener('click', () => {
          document.getElementById('edit-profile-form').style.display = 'block';
        });
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.detail || 'Customer not found'}`);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
      alert('Error fetching customer details. Please try again later.');
    }
  };



  const updateCustomerDetails = async (event) => {
    event.preventDefault();

    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');
    const username = document.getElementById('username').value;
    const mobile_no = document.getElementById('mobile_no').value;
    const imageInput = document.getElementById('image').files[0];

    // Clear any previous error messages
    document.getElementById('error').innerText = ''; 

    // If an image is provided, upload it
    let imageUrl = '';
    if (imageInput) {
        const formData = new FormData();
        formData.append('file', imageInput);  // 'file' is the key used by Cloudinary
        formData.append('upload_preset', 'ecommerce_upload');  // Your Cloudinary upload preset

        try {
            const uploadResponse = await fetch('https://api.cloudinary.com/v1_1/dtyxxpqdl/image/upload', { // Replace 'your_cloud_name' with your Cloudinary cloud name
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();
            if (uploadData.secure_url) {
                imageUrl = uploadData.secure_url;  // Cloudinary returns the image URL in 'secure_url'
            } else {
                document.getElementById('error').innerText = 'Image upload failed. Please try again.';
                return;
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            document.getElementById('error').innerText = 'Error uploading image. Please try again later.';
            return;
        }
    }

    // Prepare customer update data
    const info = {
        user: username,
        mobile_no,
        image: imageUrl || undefined, // If no image, don't include the image field
    };

    // Update customer profile
    try {
        const response = await fetch(`https://quick-bite-backend-ovp5144ku-sabrinapritys-projects.vercel.app/customer/customer-detail/${user_id}/`, {
            method: 'PUT',
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(info),
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            fetchCustomerDetails(); // Fetch updated details after successful update
            document.getElementById('edit-profile-form').style.display = 'none'; 
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.detail || 'Could not update profile'}`);
        }
    } catch (error) {
        console.error('Error updating customer details:', error);
        alert('Error updating customer details. Please try again later.');
    }
};



  document.getElementById('update-profile-form').addEventListener('submit', updateCustomerDetails);

  fetchCustomerDetails();