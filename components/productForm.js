import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"


export default function ProductForm(
    {
        _id,
        title: currentTitle,
        description: currentDescription,
        price: currentPrice
    }) {

    const [title, setTitle] = useState(currentTitle || '')
    const [description, setDescription] = useState(currentDescription || '')
    const [price, setPrice] = useState(currentPrice || '')
    const [goToProducts, setGoToProducts] = useState(false)

    const router = useRouter()

    async function saveProduct(e) {
        e.preventDefault()
        const data = { title, description, price }
        if (_id) {
            await axios.put('/api/products', {...data,_id})
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }
    if (goToProducts) router.push('/products')
    return (
        <form onSubmit={saveProduct}>
            <label>Product name:</label>
            <input type="text" placeholder="product name"
                value={title} onChange={(e) => setTitle(e.target.value)}
            />
            <label>Description:</label>
            <textarea placeholder="description"
                value={description} onChange={(e) => setDescription(e.target.value)}
            />
            <label>Price:</label>
            <input type="number" placeholder="price"
                value={price} onChange={(e) => setPrice(e.target.value)}
            />
            <button type="submit" className="btn-primary">Save</button>
        </form>
    )
}