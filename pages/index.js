import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from "axios"


//https://www.youtube.com/watch?v=WTUYem2IxLA

const CheckoutForm = ( { success, carderror }) => {
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type:'card',
      card: elements.getElement(CardElement)

    })
    if (!error) {
      const { id } = paymentMethod;
      try {
        const {data} = await axios.post("/api/charge", {id,amount: 1099})
        console.log(data)
        success()
      } catch (error) {
        console.log (error)
        carderror() 
      }
    }
  }

  return  <form 
            onSubmit={handleSubmit} 
            style = {{maxWidth: "400px",  margin: "0 auto"}}>
    <h2>Price: 10.99 USD</h2>
    <img 
      src = "https://images.ricardocuisine.com/services/recipes/500x675_7700.jpg"
      style = {{maxWidth: "100px"}}/>
    <CardElement/>
    <button type="submit" disables= {!stripe}>Pay</button>
  </form>
}
const stripePromise = loadStripe("pk_test_51HNa2xEEYAfc1YSvoy824VFbCsvPpDZZsVKcNzWXNIYaiNq6NyTfs0KP67mk8RGCscKLQWiaCE47ElXNnCiJL9zp0000DqEkMw")

const Index = () => {
  const [status, setStatus] = React.useState("ready")

  if (status === "success") {
    return <div>Congrats on your empanadas</div>
  }
  if (status === "carderror") {
    return <div>There was a problem with your card</div>
  }
  return <Elements stripe={stripePromise}> 
    <CheckoutForm 
      success={() => {setStatus("success")}}
      carderror = {() => {setStatus("carderror")}}/> </Elements>
}
 export default Index
