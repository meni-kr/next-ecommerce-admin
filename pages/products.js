import Layout from "@/components/Layout";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Products() {
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios.get('/api/products')
            .then(response => {
                setProducts(response.data)
            })
    }, [])

    console.log('products:', products)

    return (
        <Layout>
            <Link className={'bg-blue-900 text-white rounded-md py-1 px-2'} href={'/products/new'}>
                Add new product</Link>
            <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Product name</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((product, idx) => (
                            <tr key={idx}>
                                <td>{product.title}</td>
                                <td>
                                    
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Layout>
    )
}