import { uploadService } from "@/service/upload.service"
import axios from "axios"
import { useRouter } from "next/router"
import { useState } from "react"

export default function ProductForm(
    {
        _id,
        title: currentTitle,
        description: currentDescription,
        price: currentPrice,
        images: existingImages,
    }) {

    const [title, setTitle] = useState(currentTitle || '')
    const [description, setDescription] = useState(currentDescription || '')
    const [price, setPrice] = useState(currentPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)

    const router = useRouter()

    async function saveProduct(e) {
        e.preventDefault()
        const data = { title, description, price, images }
        if (_id) {
            await axios.put('/api/products', { ...data, _id })
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }
    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImages(e) {
        const files = e.target?.files
        if (files?.length > 0) {
            const urls = await uploadService.cloudUploadMany(files)
            setImages(oldImages => {
                return [...oldImages, ...urls]
            })
        }
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Product name:</label>
            <input type="text" placeholder="product name"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>
                Photos

            </label>
            <div className="mb-2 flex flex-wrap gap-2">
                {
                    !!images?.length && images?.map((link, idx) => (
                        <div key={idx} className="h-24">
                            <img src={link} alt="" className="rounded-lg" />
                        </div>
                    ))

                }

                <label className="w-24 h-24 flex flex-col cursor-pointer items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    <div>
                        Upload
                    </div>
                    <input type="file" multiple className="hidden" onChange={uploadImages} />
                </label>

            </div>
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