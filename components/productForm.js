import { uploadService } from "@/service/upload.service"
import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Spinner from "./spinner"
import { ReactSortable } from "react-sortablejs"

export default function ProductForm(
    {
        _id,
        title: currentTitle,
        description: currentDescription,
        price: currentPrice,
        images: existingImages,
        category: assignedCategory,
        properties:assignedProperties
    }) {

    const [title, setTitle] = useState(currentTitle || '')
    const [description, setDescription] = useState(currentDescription || '')
    const [price, setPrice] = useState(currentPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [category, setCategory] = useState(assignedCategory || '')
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([])
    const [productProperties, setProductProperties] = useState(assignedProperties || {})

    const router = useRouter()

    useEffect(() => {
        axios.get('/api/categories').then(result => {
            setCategories(result.data)
        })
    }, [])

    async function saveProduct(e) {
        e.preventDefault()
        const data = { title, description, price, images, category,
            properties:productProperties}
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
            setIsUploading(true)
            const urls = await uploadService.cloudUploadMany(files)
            setImages(oldImages => {
                return [...oldImages, ...urls]
            })
            setIsUploading(false)
        }
    }

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let catInfo = categories.find(({ _id }) => _id === category)
        propertiesToFill.push(...catInfo.properties)
        while (catInfo.parent?._id) {
            const parentCat = categories.find(({ _id }) => _id === catInfo.parent?._id)
            propertiesToFill.push(...parentCat.properties)
            catInfo = parentCat
        }
    }

    function setProductProp(propName, value) {
        setProductProperties(prev => {
            const newProductProp = { ...prev }
            newProductProp[propName] = value
            return newProductProp
        })
    }
    return (
        <form onSubmit={saveProduct}>
            <label>Product name:</label>
            <input type="text" placeholder="product name"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
                <option value=''>Uncategorized</option>
                {categories.length > 0 && categories.map((category, idx) => (
                    <option key={idx} value={category._id}>{category.name}</option>
                ))}
            </select>
            <label>properties</label>
            {propertiesToFill.length > 0 && propertiesToFill.map((p,idx) => (
                <div key={idx} className="flex gap-1">
                    <div>{p.name}</div>
                    <select
                        value={productProperties[p.name]} 
                        onChange={(e) => setProductProp(p.name, e.target.value)}>
                            <option value="">Not assigned</option>
                        {p.values.map((val, idx) => (
                            <option key={idx} value={val}>{val}</option>
                        ))}
                    </select>
                </div>
            ))}
            <label>
                Photos
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable
                    className="flex flex-wrap gap-1"
                    list={images}
                    setList={setImages}
                >
                    {
                        !!images?.length && images?.map((link, idx) => (
                            <div key={idx} className="h-24">
                                <img src={link} alt="" className="rounded-lg" />
                            </div>
                        ))

                    }
                </ReactSortable>
                {
                    isUploading && (
                        <div className="h-24 p-1 flex items-center">
                            <Spinner />
                        </div>
                    )
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