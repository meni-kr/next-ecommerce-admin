import { mongooseConnect } from "@/lib/mongoose"
import { Category } from "@/models/categories"
import { isAdminRequest } from "./auth/[...nextauth]"

export default async function handle(req, res) {
    const { method } = req
    await mongooseConnect()
    await isAdminRequest(req, res)

    if (method === 'GET') {
        res.json(await Category.find().populate('parent'))
    }

    if (method === 'POST') {
        const { name, parentCategory, properties } = req.body
        const categoryDoc = await Category.create({
            name,
            parent: parentCategory ? parentCategory : null,
            properties,
        })
        res.json(categoryDoc)
    }

    if (method === 'PUT') {
        const { name, parentCategory, _id, properties } = req.body
        const categoryDoc = await Category.updateOne({ _id }, {
            name,
            parent: parentCategory ? parentCategory : null,
            properties,
        })
        res.json(categoryDoc)
    }

    if (method === "DELETE") {
        const { _id } = req.query
        await Category.deleteOne({ _id })
        res.json('ok')
    }

}