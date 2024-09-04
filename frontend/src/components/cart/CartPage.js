import { useEffect, useState } from "react";
import CartHeader from "./CartHeader";
import Checkout from "./Checkout";
import PaymentMethods from "./PaymentMethods";
import Product from "./Product";
import api, {saveCart, postRequest } from "util/api";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCart } from "../../redux/CartSlice";
import DotLoaderSpinner from "components/loader/Loading";
import { useAuthContext } from "store/AuthContext";
import { useQuery } from "@tanstack/react-query";

const updateCart = async (cart) => {
    const { data} = await postRequest(`/user/cart/updatecart`,
    {products: cart.cartItems});
    return data;
}

const useCart = (user, cart) => {

    const cart = useQuery({
        queryKey: [user, cart],
        queryFn : () => updateCart(cart)
    })


}



const CartPage = ({ cart }) => {
    const { token, currentUser } = useAuthContext();
    const dispatch = useDispatch();
    
    const [selected, setSelected] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        if (currentUser) {
            const update = async () => {
                //const { data } = await api.put(`/user/cart/updatecart`, {
                //    products: cart.cartItems,                     
                //}                

                try {
                    const { data} = await postRequest(`/user/cart/updatecart`,
                    {products: cart.cartItems});
                } catch(error) {
                    if (!error.response) {
                        // Network error occurred
                        console.error('Network error:', error);
                      } else {
                        // The server responded with a status other than 200 range
                        console.error('Error response:', error.response);
                      }

                }

                if ( data.status === 200 ) {                
                     dispatch(updateCart(data))
                };                 
            };

            if (cart.cartItems.length > 0) {
                update();
            }
            
         } else {            
            navigate("/signin");
        }
    }, []);

    useEffect(() => {
        setShippingFee(
            selected
                .reduce(
                    (total, product) =>
                        total + Number(product.shipping),
                    0
                )
                .toFixed(2)
        );
        setSubTotal(
            selected
                .reduce(
                    (total, product) =>
                        total + product.price * product.qty,
                    0
                )
                .toFixed(2)
        );
        setTotal(
            (
                selected.reduce(
                    (total, product) =>
                        total + product.price * product.qty,
                    0
                ) + selected.reduce(
                    (total, product) =>
                        total + Number(product.shipping),
                    0
                ) 
            ).toFixed(2)
        );
        
    }, [selected]);

    const [state, setState] = useState();
    const saveCartToDbHandler = async (e) => {
        e.preventDefault();
        setState(e);
        
        if (currentUser) {
            setLoading(true);
            
            const res = await saveCart(selected);
            
            navigate("/checkout");
            setLoading(false);
        } else {
            navigate("/signin");
        }
    };

    return (
        <>
            {loading && <DotLoaderSpinner loading={loading} />}
            <div className="flex flex-col md:flex-row px-2 py-8 md:px-8 gap-4">
                <div className="md:w-3/4">
                    <CartHeader
                        cartItems={cart.cartItems}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <div className=" bg-white rounded py-2 px-4 border">
                        <h2 className="font-bold text-3xl my-2">
                            Shopping Cart
                        </h2>
                        <div className="w-full bg-slate-200 h-[1px]" />
                        {cart.cartItems.map((product, i) => (
                            <Product
                                product={product}
                                key={i}
                                selected={selected}
                                setSelected={setSelected}
                                cart={cart}
                            />
                        ))}
                    </div>
                </div>
                <div className="md:w-1/4">
                    <Checkout
                        subtotal={subTotal}
                        shippingFee={shippingFee}
                        total={total}
                        selected={selected}
                        saveCartToDbHandler={saveCartToDbHandler}
                    />
                    <PaymentMethods />
                </div>
            </div>
        </>
    );
};

export default CartPage;
