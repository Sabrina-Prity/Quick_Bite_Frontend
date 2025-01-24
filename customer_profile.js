const fetchCustomerDetails = async () => {
    const user_id = localStorage.getItem('user_id');
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://127.0.0.1:8000/customer/customer-detail/${user_id}/`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const customer = await response.json();
        const customerDetailsDiv = document.getElementById('customer-details');
        customerDetailsDiv.innerHTML = `
          <div class="customer-card">
            <img src="${customer.image}" alt="Customer Image" class="customer-image">
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

        // Prepare customer update data
        const info = {
          user: username,
          mobile_no,
          image: imageUrl,
        };

        // Update customer profile
        const response = await fetch(`http://127.0.0.1:8000/customer/customer-detail/${user_id}/`, {
          method: 'PUT',
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(info),
        });

        if (response.ok) {
          alert('Profile updated successfully!');
          fetchCustomerDetails(); 
          document.getElementById('edit-profile-form').style.display = 'none'; 
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.detail || 'Could not update profile'}`);
        }
      } else {
        document.getElementById('error').innerText = 'Image upload failed. Please try again.';
      }
    } catch (error) {
      console.error('Error updating customer details:', error);
      alert('Error updating customer details. Please try again later.');
    }
  };

  document.getElementById('update-profile-form').addEventListener('submit', updateCustomerDetails);

  fetchCustomerDetails();