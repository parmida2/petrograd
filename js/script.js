function init(){
    fetch("https://kea-alt-del.dk/t5/api/categories").then(r => r.json()).then(
    function(data){
        categoriesReceived(data)
    }
  )
}
init();

function categoriesReceived(cats) {
    createNavigation(cats);
    createSections(cats);
    fetchProducts();
}

function createSections(categories) {
    //<section id="starter">
    //<h2>starter</h2>
    categories.forEach(category => {
        const section = document.createElement("section");
        section.setAttribute("id", category);
        const h2 = document.createElement("h2");
        h2.textContent = category;
        section.appendChild(h2); document.querySelector(".productlist").appendChild(section);
} )
}


function createNavigation(categories) {
    categories.forEach(cat => {
    console.log(cat)
    const a = document.createElement("a");
    a.textContent = cat;
    a.setAttribute("href", `#${cat}`)
    document.querySelector("nav").appendChild(a);
})
}

function fetchProducts() {
// fetch data
fetch("https://kea-alt-del.dk/t5/api/productlist")
  .then(function (response) {
    console.log(response)
    return response.json();
  })
  .then(function (data) {
    dataReceived(data);
  })
}

function dataReceived(products) {
  //loop through products
  products.forEach(showProduct)
}

//executed once for each product
function showProduct(myProduct) {
  console.log(myProduct)
  //finding the template
  const temp = document.querySelector("#productTemplate").content;
  //clone the template
  const myCopy = temp.cloneNode(true);

const img = myCopy.querySelector(".product_image");
img.setAttribute("src", `https://kea-alt-del.dk/t5/site/imgs/small/${myProduct.image}-sm.jpg`)

    if (!myProduct.discount) {
    //console.log("NOT DISCOUNT")
    myCopy.querySelector(".data_discount").classList.add("hidden")
  }
  if (myProduct.vegetarian) {
    myCopy.querySelector(".vegetarian").classList.remove("hidden");
  }

  if (myProduct.alcohol) {
      myCopy.querySelector(".alcoholic").classList.remove("hidden");
  }

  if (myProduct.soldout) {
    const p = document.createElement("p");
    p.textContent = "Sold Out";
    p.classList.add("soldout")
    myCopy.querySelector("article").appendChild(p)
  }


  //1. find the article
  const article = myCopy.querySelector("article");

  //2. add classes
  if (myProduct.vegetarian) {
    article.classList.add("vegetarian")
  }
  if (myProduct.alcohol) {
    article.classList.add("alcoholic")
  }


    //fill out the template
  myCopy.querySelector(".data_name").textContent = myProduct.name;
  myCopy.querySelector(".data_description").textContent = myProduct.shortdescription;
  myCopy.querySelector("span").textContent = myProduct.price;
  myCopy.querySelector(".span1").textContent = myProduct.discount;

  myCopy.querySelector("button ").addEventListener("click", () => {
    fetch(`https://kea-alt-del.dk/t5/api/product?id=` + myProduct.id)
      .then(res => res.json())
      .then(showDetails);
  });

   //append
  const parentElem = document.querySelector("section#" + myProduct.category);
  parentElem.appendChild(myCopy)
}

const modal = document.querySelector(".modal-background");
//once we have our data, ....
function showDetails(data) {
  console.log(data)
  modal.querySelector(".modal-name").textContent = data.name;
  modal.querySelector(".modal-description").textContent = data.longdescription;
  modal.querySelector(".modal-price").textContent = data.price;
  modal.querySelector(".modal-discount").textContent = data.discount;
  modal.querySelector(".modal-image").setAttribute("src", `https://kea-alt-del.dk/t5/site/imgs/small/${data.image}-sm.jpg`)

  //  //...
  modal.classList.remove("hide");
}


function veggieFilterClicked() {
  veggiefilter.classList.toggle("active")
  //b select all non veggie
  const articles = document.querySelectorAll("article:not(.vegetarian)");
  //console.log(articles)
  articles.forEach(elem => {
    elem.classList.toggle("hidden")
  })
}

const alcoholfilter = document.querySelector("#alcoholfilter");
alcoholfilter.addEventListener("click", alcoholFilterClicked);


function alcoholFilterClicked() {
  alcoholfilter.classList.toggle("active")
  //b select all non alcoholic
  const articles = document.querySelectorAll("article.alcoholic");
  //console.log(articles)
  articles.forEach(elem => {
    elem.classList.toggle("hidden")
  })
}


//close the modal when clicked
modal.addEventListener("click", () => {
  modal.classList.add("hide");
});

