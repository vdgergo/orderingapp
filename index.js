import {menuArray} from '/orderingapp/data.js';
import {couponCodes} from './discounts.js';
const userOrder = []
let userOrderTotalPrice = 0
const activatedCoupons = []
const discountForm = document.getElementById("discount-area")
const paymentForm = document.getElementById("payment-form")

document.addEventListener("click", function(e){
  if (e.target.dataset.additem){
    addItemToOrder(parseInt(e.target.dataset.additem))
  }
  else if (e.target.dataset.increase){
    increaseOrderItem(parseInt(e.target.dataset.increase))
  }
  else if (e.target.dataset.decrease){
    decreaseOrderItem(parseInt(e.target.dataset.decrease))
  }
  else if (e.target.dataset.remove){
    removeOrderItem(parseInt(e.target.dataset.remove))
  }
  else if (e.target.id ==='coupon-btn'){
    document.getElementById("discount-area").classList.toggle("hidden")
  }
  else if (e.target.id ==='accept-btn'){
    console.log("accept gombb")
    document.getElementById("payment-modal").classList.toggle("hidden")
  }
})

discountForm.addEventListener("submit", function(e){
  e.preventDefault()
  const discountFromData = new FormData(discountForm)
  const enteredCode = discountFromData.get("coupon-code")
  applyCoupon(enteredCode)
  renderOrder()
})

paymentForm.addEventListener("submit",function(e){
  e.preventDefault()
  document.getElementById("pay-btn").innerHTML = '<img class="rolling-svg" src="img/Rolling-1.8s-216px.svg">'
  const paymentFormData = new FormData(paymentForm)
  const buyerName = paymentFormData.get("buyer-name")
  setTimeout(function(){
    document.getElementById("payment-modal").classList.toggle("hidden")
    document.getElementById("checkout-area").innerHTML = `
  <div class="checkout-msg">Thanks, ${buyerName}! Your order is on its way!</div>`
  },1000)

})

function addItemToOrder(foodId){
  const selectedFood = menuArray.filter(function (foodItem){return foodItem.id === foodId})[0]
  let orderedIds = userOrder.map(function(order){return order.id})
  if (orderedIds.includes(selectedFood.id)){
    const selectedOrder = userOrder.filter(function(order){return order.id === foodId})[0]
    selectedOrder.count += 1

  }
  else{
    selectedFood.count = 1
    userOrder.push(selectedFood)
  }
  renderOrder()
}

function increaseOrderItem (foodId){
  const selectedOrder = userOrder.filter(function (foodItem){return foodItem.id === foodId})[0]
  selectedOrder.count += 1
  renderOrder()
}

function decreaseOrderItem (foodId){
  const selectedOrder = userOrder.filter(function (foodItem){return foodItem.id === foodId})[0]
  if (selectedOrder.count > 1) {
    selectedOrder.count -= 1
  }
  
  else if (selectedOrder.count === 1){
    selectedOrder.count -= 1
    const decreaseButton = document.querySelector(`[data-decrease="${foodId}"`).inactive = true
  }
  renderOrder()
}
function removeOrderItem (foodId){
  const selectedOrder = userOrder.filter(function (foodItem){return foodItem.id === foodId})[0]
  const index = userOrder.indexOf(selectedOrder)
  userOrder.splice(index,1)
  renderOrder()
}

function calculateTotalPrice(){
  userOrderTotalPrice=0
  for (const order of userOrder){
    userOrderTotalPrice += (order.price * order.count)
  }



  for (const activatedCoupon of activatedCoupons){
     if (activatedCoupon.type === 'discount'){
      userOrderTotalPrice = userOrderTotalPrice * ((100-activatedCoupon.value)/100)
    }
}}
    
function applyCoupon(code){
  const activatedCoupon = couponCodes.filter(function(coupon){return coupon.code === code})[0]
  if (activatedCoupon){
    activatedCoupons.push(activatedCoupon)
    const index = couponCodes.indexOf(activatedCoupon)
    couponCodes.splice(index,1)
  }
}

function renderMenu(){
  const menuAreaEl = document.getElementById("menu-area")
for (const f of menuArray){
  menuAreaEl.innerHTML += `
  <div class="food-item">
  <img class="food-icon" src="img/${f.img}">
  <div class="food-detais-wrapper">
    <h3>${f.name}</h3>
    <p>${f.ingredients.join(', ')}</p>
    <div class="price">$${f.price}</div>
  </div>
  <button class="add-btn" data-additem="${f.id}">+</button>
  </div>
`
}}

function renderOrder(){
  document.getElementById("checkout-area").classList.remove("hidden")
  const itemContainerEl = document.getElementById("item-container")
  itemContainerEl.innerHTML = ""
  for (const order of userOrder){
    itemContainerEl.innerHTML += `
    <div class="added-item">
          <h3>${order.name}</h3>
          <button class="remove-btn" data-remove="${order.id}">remove</button>
          <div class="quantity-wrapper">
            <button class="increase-btn-small" data-increase="${order.id}">+</button>
            <div class="pieces">${order.count} pcs</div>
            <button class="decrease-btn-small" data-decrease="${order.id}">-</button>
          </div>
          <div class="price">$${order.price * order.count}</div>
        </div>`
  }
  calculateTotalPrice()
  document.getElementById("total-price").innerText = "$"+ userOrderTotalPrice
}

renderMenu()

