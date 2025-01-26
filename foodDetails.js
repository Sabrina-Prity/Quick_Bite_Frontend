
const displayFoodDetails = () => {
    const param = new URLSearchParams(window.location.search).get("foodId");
    console.log("Food ID:", param);

    fetch(`http://127.0.0.1:8000/food/food-items-for-seller/${param}/`)
    .then((res) => res.json())
    .then((foods) => {
        console.log("Food Details:", foods);

        if (foods.length > 0) {
            const food = foods[0];
            const parent = document.getElementById("food-details");
            parent.innerHTML = ""; 

            const div = document.createElement("div");
            div.classList.add("food-detail");

            const closeButton = document.createElement("span");
            closeButton.classList.add("close-btn");
            closeButton.innerHTML = "&times;";
            closeButton.onclick = () => window.history.back();
            parent.appendChild(closeButton);

            div.innerHTML = `
                <div class="food-image">
                    <img src="${food.image}" alt="${food.name}" />
                </div>
                <div class="food-info">
                    <h4>${food.name}</h4>
                    <h6><b>Price:</b> $${food.price}</h6>
                    <h6><b>Category:</b> ${food.category}</h6>
                    <p><b>Food Details:</b> ${food.description}</p>
                    <div class="action-buttons">
                        <button class="add-to-cart-btn" onclick="addToCart('${food.id}')">Add To Cart</button>
                    </div>
                </div>
            `;

            parent.appendChild(div);
        } else {
            console.error("No food items found.");
        }
    })
    .catch((error) => {
        console.error("Error fetching food details:", error);
    });

};

displayFoodDetails();



// const displayComments = (mangoId) => {
//     fetch(`https://mango-project-six.vercel.app/product/comment/comments_by_mango/?mango_id=${mangoId}`)
//         .then((res) => res.json())
//         .then((data) => {
//             const commentsList = document.getElementById("comments-list");
//             commentsList.innerHTML = ''; 
//             // const username = localStorage.getItem("username")

//             data.forEach((comment) => {
//                 const commentDiv = document.createElement("div");
//                 commentDiv.classList.add("comment");
//                 commentDiv.innerHTML = `
//                     <p>${comment.body}</p>
//                     <small>by ${comment.user} | Rated: ${comment.rating}</small>
//                     <hr>
//                 `;
//                 commentsList.appendChild(commentDiv);
//             });

//             // Show the comment form if the user is logged in
//             const token = localStorage.getItem("token");
//             if (token) {
//                 document.getElementById("comment-form").style.display = "block";  
//                 document.getElementById("comment-login-msg").style.display = "none"; 
//             } else {
//                 document.getElementById("comment-form").style.display = "none";  
//                 document.getElementById("comment-login-msg").style.display = "block"; 
//             }
//         });
// };

// const postComment = () => {
//     const param = new URLSearchParams(window.location.search).get("mangoId");
//     console.log(param)
//     const token = localStorage.getItem("token");
//     const commentText = document.getElementById("comment-text").value;
//     const rating = document.getElementById("rating").value;  // Assuming a dropdown or a similar input for the rating

//     if (!token) {
//         alert("You must be logged in to post a comment.");
//         return;
//     }

//     const commentData = {
//         body: commentText,
//         rating: rating,
//         mango: param,  
//     };

//     console.log(commentData);
//     fetch('https://mango-project-six.vercel.app/product/comment/', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Token ${token}`,
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(commentData),
//     })
//     .then((response) => response.json())
//     .then((data) => {
        
//         console.log("Comment posted:", data);
//         // commentText.value = "";
//         // rating.value = ""; 
//         // displayComments(param);  
//         location.reload();
        
//     })
//     .catch((error) => {
//         console.error("Error posting comment:", error);
//     });
// };