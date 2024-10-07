import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";


export default function OrdersPage() {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        axios.get('/api/orders')
            .then(response => {
                setOrders(response.data)
            })
    }, [])

    return (
        <Layout>
            <h1>Orders</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Recipient</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 && orders.map((order, idx) => (
                        <tr key={idx}>
                            <td>{new Date(order.createdAt).toLocaleString()}</td>
                            <td>
                                {order.name} {order.email}<br />
                                {order.city} {order.postalCode} {order.country}<br />
                                {order.streetAddress}
                            </td>
                            <td>
                                {order.line_items.map((line, idx) => (
                                    <span key={idx}>
                                        {line.price_data.product_data.name} x {line.quantity}<br />
                                    </span>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    )
}