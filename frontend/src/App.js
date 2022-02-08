import React, { useEffect, useState} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/Home'
import ProductDetails from './components/product/ProductDetails'

//Cart Imports
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'

import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'

//Auth or User Imports
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'

//Admin Imports
import Dashboard from './components/admin/Dashboard'
import NewProduct from './components/admin/NewProduct'
import ProductsList from './components/admin/ProductsList'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'
import ProcessOrder from './components/admin/ProcessOrder'
import UsersList from './components/admin/UsersList'
import UpdateUser from './components/admin/UpdateUser'
import ProductReviews from './components/admin/ProductReviews'

import ProtectedRoute from './components/route/ProtectedRoute'
import { loadUser } from './actions/userActions'
import { useSelector } from 'react-redux'
import store from './store'
import axios from 'axios'

//Payment
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

function App() {

  const [stripeApiKey, setStripeApiKey] = useState('')

  useEffect(() => {
    store.dispatch(loadUser())

    async function getStripeApiKey() {
      const { data } = await axios.get('/api/v1/stripeapi')

      console.log(data.stripeApiKey)
      setStripeApiKey(data.stripeApiKey)
    }

    getStripeApiKey();
  }, [])

  const { user, isAuthenticated, loading } = useSelector(state => state.auth)

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          
          <Routes>
            <Route path="/" element={ <Home /> } exact/>
              <Route path="/search/:keyword" element={ <Home /> } />
              <Route path="/product/:id" element={ <ProductDetails /> } />

              <Route path="/cart" element={ <Cart /> } exact />
              <Route path='/shipping' element={<ProtectedRoute/>}>
                <Route path="/shipping" element={ <Shipping /> } />
              </Route>
              <Route path='/confirm' element={<ProtectedRoute/>}>
                <Route path="/confirm" element={ <ConfirmOrder /> } />
              </Route>
            

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="/password/reset/:token" element={<NewPassword />} />
              <Route path='/me' element={<ProtectedRoute/>}>
                <Route path="/me" element={ <Profile /> } />
              </Route>
              <Route path='/me/update' element={<ProtectedRoute/>}>
                <Route path="/me/update" element={ <UpdateProfile /> } />
              </Route>
              <Route path='/password/update' element={<ProtectedRoute/>}>
                <Route path="/password/update" element={ <UpdatePassword /> } />
              </Route>
              <Route path='/success' element={<ProtectedRoute/>}>
                <Route path="/success" element={ <OrderSuccess /> } />
              </Route>
              <Route path='/orders/me' element={<ProtectedRoute/>}>
                <Route path="/orders/me" element={ <ListOrders /> } />
              </Route>
              <Route path='/order/:id' element={<ProtectedRoute/>}>
                <Route path="/order/:id" element={ <OrderDetails /> } />
              </Route>
            
          </Routes>
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Routes>
                <Route path='/payment' element={<ProtectedRoute/>}>
                  <Route path="/payment" element={ <Payment /> } />
                </Route>
              </Routes>
            </Elements>
          }
        </div>
        <Routes>
            <Route path='/dashboard' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/dashboard" element={ <Dashboard /> } />
            </Route>
            <Route path="/admin/products" element={ <ProductsList /> } /> 
            <Route path='/admin/product' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/product" element={ <NewProduct /> } />
            </Route>
            <Route path='/admin/product/:id' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/product/:id" element={ <UpdateProduct /> } />
            </Route>
            <Route path='/admin/orders' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/orders" element={ <OrdersList /> } />
            </Route>
            <Route path='/admin/order/:id' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/order/:id" element={ <ProcessOrder /> } />
            </Route>
            <Route path='/admin/users' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/users" element={ <UsersList /> } />
            </Route>
            <Route path='/admin/user/:id' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/user/:id" element={ <UpdateUser /> } />
            </Route>
            <Route path='/admin/reviews' isAdmin={true} element={<ProtectedRoute/>}>
              <Route path="/admin/reviews" element={ <ProductReviews /> } />
            </Route>
        </Routes>

        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
      </div>
    </Router>
  )
}

export default App;
