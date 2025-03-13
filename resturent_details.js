
document.getElementById("products-btn").addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    location.reload(); // Refreshes the page
});




const loadCategorys = () => {
    const param = new URLSearchParams(window.location.search).get("restaurantId");
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
    const param = new URLSearchParams(window.location.search).get("restaurantId");
    const parent = document.getElementById("card");
    const loading = document.getElementById("loading");
    const noData = document.getElementById("nodata");

    // ✅ Show the loading image
    loading.style.display = "flex";
    noData.style.display = "none";
    parent.innerHTML = "";

    fetch(`https://quick-bite-backend-pink.vercel.app/food/food-items-for-seller/${param}/?search=${search ? search : ""}`)
        .then((res) => res.json())
        .then((data) => {
            // ✅ Hide the loading image
            loading.style.display = "none";

            if (data.length > 0) {
                noData.style.display = "none";
                displayFoods(data);
            } else {
                parent.innerHTML = "";
                noData.style.display = "block"; // Show 'No Data' message
            }
        })
        .catch((err) => {
            console.log(err);
            loading.style.display = "none"; // Hide loading if an error occurs
            noData.style.display = "block"; // Show 'No Data' message on error
        });
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

