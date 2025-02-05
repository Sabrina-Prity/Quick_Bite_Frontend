const loadcartId = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login");
        return;
    }
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
loadcartId();


const getparams = () => {
    const token = localStorage.getItem("token");
    const param = new URLSearchParams(window.location.search).get("resturentId");
    // console.log("Resturent Id", param);
    fetch(`https://quick-bite-backend-pink.vercel.app/seller/seller-detail/${param}`,{
        method : "GET",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        }
    })
        .then((res) => res.json())
        .then((data) => {
            // console.log("Resturent Details", data);
            displayResturentDetails(data);
        });
};

getparams();


const displayResturentDetails = (data) => {
    // console.log("Resturent Details", data)
    const resturentContainer = document.getElementById("resturent-container");

    if (!resturentContainer) {
        console.error("Restaurant container not found!");
        return;
    }

    resturentContainer.innerHTML = "";
    const formattedDistrict = data?.district
            ? data.district.charAt(0).toUpperCase() + data.district.slice(1).toLowerCase()
            : ""; 
    
            // Fix the image URL
        let imageUrl = data?.image;
        
        // Remove incorrect "image/upload/" prefix if it exists
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        // Ensure the image URL is properly formatted
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }
    resturentContainer.innerHTML = `
    
        <div class="d-flex align-items-start gap-3">
            <!-- Image Section -->
            <div class="col-md-7">
                <img src="${imageUrl}" alt="${data.company_name}" class="img-fluid rounded w-100">
            </div>
            <!-- Details Section -->
            <div class="res-Details col-md-5">
                <h2>${data.company_name}</h2>
                <p><strong>Street Name:</strong> ${data.street_name}</p>
                <p><strong>District:</strong> ${formattedDistrict}</p>
                <p><strong>Postal Code:</strong> ${data.postal_code}</p>
                <p><strong>Mobile Number:</strong> ${data.mobile_no}</p>

                <button class="details-btn" onclick="window.location.href='resturent-review.html?sellerId=${data.id}'">
                Resturent Reviews
                </button>
            </div>
        </div>
    `;
};






const loadCategorys = () => {
    const param = new URLSearchParams(window.location.search).get("resturentId");
    console.log("Resturent Id", param);
    const token = localStorage.getItem("token");
    fetch(`https://quick-bite-backend-pink.vercel.app/category/seller_category_list/${param}/`)
        .then((res) => res.json())
        // .then((data) => console.log("Category" ,data))
        .then((data) => displayCategorys(data))
        .catch((err) => console.log(err));
};

const displayCategorys = ((data)=>{
    // console.log("Data",data)
    data?.forEach((item)=>{
        // console.log("Item Name", item)
        const parent = document.getElementById("category");
            const li = document.createElement("li");
            li.classList.add("dropdown-item");
            // li.innerText = item?.name;
            li.innerHTML= `
            <li onclick="loadFoods('${item?.name}')"> ${item?.name} </li>
            `
            parent.appendChild(li);
    });
 });

 const loadFoods = (search) => {
    // console.log(search)
    const param = new URLSearchParams(window.location.search).get("resturentId");
    document.getElementById("card").innerHTML = "";
    fetch(`https://quick-bite-backend-pink.vercel.app/food/food-items-for-seller/${param}/?search=${search ? search : ""}`) 
        .then((res) => res.json())
        // .then((data) => console.log(data))
        .then((data) =>{
            // console.log(data)
            if (data.length > 0)
            {
                document.getElementById("nodata").style.display = "none";
                displayFoods(data)
            }
            else{
                document.getElementById("card").innerHTML = "";
                document.getElementById("nodata").style.display = "block";
            }
        }) 
        .catch((err) => console.log(err));
};

const displayFoods = (items) => {
    const parent = document.getElementById("card");
    parent.innerHTML = ""; 

    items?.forEach((item) => {
        console.log("Food", item)

        // Fix the image URL
        let imageUrl = item?.image;
        
        // Remove incorrect "image/upload/" prefix if it exists
        if (imageUrl.includes("image/upload/https://")) {
            imageUrl = imageUrl.replace("image/upload/", "");  
        }

        // Ensure the image URL is properly formatted
        if (!imageUrl.startsWith("https://")) {
            imageUrl = `https://res.cloudinary.com/dtyxxpqdl/image/upload/${imageUrl}`;
        }
        const div = document.createElement("div");
        div.classList.add("items-card");
        div.innerHTML = `
            <img class="items-img" src="${imageUrl}" />
            <h4>${item?.name}</h4>
            <h6>Price: $${item?.price}</h6>
            <h6>Category: ${item?.category}</h6>
            
            <button class="detail-btn">
                <a href="foodDetails.html?foodId=${item.id}&sellerId=${item.seller}">Details</a>
            </button>
            <button class="detail-btn">
                <a  onclick="addToCart('${item.id}', '${item.price}')">Add To Cart</a>
            </button>
        `;
        parent.appendChild(div);
    });
};


const handleSearch = (event) =>{
    event.preventDefault();
    const value = document.getElementById("search").value;
    console.log(value);
    loadFoods(value);
}




loadCategorys();

loadFoods();

