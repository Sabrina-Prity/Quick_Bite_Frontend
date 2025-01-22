const fetchSellerCategories = () => {
    const sellerId = localStorage.getItem("seller_id");
    const token = localStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/seller_category_list/${sellerId}/`, {
        method: 'GET',
        headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.detail) {
                console.error(data.detail);
            } else {
                console.log("Categories:", data);
                // Render categories in the frontend
            }
        })
        .catch((error) => console.error("Error fetching categories:", error));
};
















const deleteSellerCategory = (categoryId) => {
    const sellerId = localStorage.getItem("seller_id");

    fetch(`http://127.0.0.1:8000/seller/${sellerId}/categories/${categoryId}/`, {
        method: "DELETE",
    })
        .then((response) => {
            if (response.status === 204) {
                console.log("Category deleted successfully!");
                fetchCategories(); // Refresh the list
            } else {
                console.error("Failed to delete category.");
            }
        })
        .catch((error) => console.error("Error deleting category:", error));
};

fetchCategories();



const loadCategorys = () => {
    fetch("http://127.0.0.1:8000/seller/seller-list/")
        .then((res) => res.json())
        // .then((data) => console.log(data))
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

 const loadFoods = (search) => 
    {
        console.log(search)
    document.getElementById("card").innerHTML = "";
    fetch(`http://127.0.0.1:8000/food/food-item/?search=${search ? search : ""}`) 
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
        const div = document.createElement("div");
        div.classList.add("item-card");
        div.innerHTML = `
            <img class="item-img" src="${item?.image}" />
            <h4>${item?.name}</h4>
            <h6>Price: $${item?.price}</h6>
            <h6>Category: ${item?.category}</h6>
            <p>${item?.description.slice(0, 70)}</p>
            <button class="details-btn">
                <a href="mangoDetails.html?mangoId=${item.id}">Details</a>
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



const createCart=()=>{
    const token = localStorage.getItem("token");
    console.log("Create Cart",token)
    if(!token){
        alert("Please Login!")
        return
    }
    object = {
        user : localStorage.getItem("user_id"),
    }
    console.log(object)
    fetch("http://127.0.0.1:8000/add_to_cart/cart_create/",{
        method : "POST",
        headers : {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(object)
    })

}

createCart();