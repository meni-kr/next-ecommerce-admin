import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

const URL = '/api/categories'

function Categories({swal}) {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [parentCategory, setParentCategory] = useState('')
    const [editMode, setEditMode] = useState({ category: {}, edit: false })

    useEffect(() => {
        getCategories()
    }, [])

    async function getCategories() {
        try {
            axios.get(URL).then(result => {
                if (result.data.length !== 0) {
                    setCategories(result.data)
                }
            })
        } catch (error) {
            console.log('cant get categories err: ', error);

        }

    }

    async function saveCategory(e) {
        e.preventDefault()
        const data = { name, parentCategory }
        try {
            if (!editMode.edit) {
                await axios.post(URL, data)
            } else {
                data._id = editMode.category._id
                await axios.put(URL, data)
            }
            getCategories()
            cancelEdit()

        } catch (error) {
            console.log('cant add new category err: ', error);
        }
    }

    function editCategory(categoryToUpdate) {
        setEditMode(oldEdit => ({ ...oldEdit, category: categoryToUpdate, edit: true }))
        setName(categoryToUpdate.name)
        setParentCategory(categoryToUpdate.parent?._id)
    }

    function deleteCategory(category){
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to Delete ${category.name}?`,
            showCancelButton:true,
            cancelButtonText:'Cancel',
            confirmButtonText:'Yes, Delete!',
            confirmButtonColor:'#d55',
            reverseButtons:true
        }).then(async result => {
            if(result.isConfirmed){
                const {_id} = category
                await axios.delete(URL+'?_id='+_id)
                getCategories()
            }
        })
    }

    function cancelEdit() {
        setName('')
        setParentCategory('')
        setEditMode({ category: {}, edit: false })
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editMode.edit ? `Edit category ${editMode.category.name}` : 'Create NEW category'}</label>
            <form onSubmit={saveCategory} className="flex gap-1">
                <input className="mb-0" type="text"
                    placeholder="Category name"
                    onChange={e => setName(e.target?.value)}
                    value={name} />
                <select className="mb-0"
                    value={parentCategory}
                    onChange={e => setParentCategory(e.target.value)}
                >
                    <option value=''>No parent category</option>
                    {
                        categories.length && categories.map((category, idx) => (
                            <option key={idx} value={category._id}>{category.name}</option>
                        ))
                    }
                </select>
                <button type="submit" className="btn-primary">Save</button>
            </form>
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>Category name</td>
                        <td>Parent Category</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {
                        categories.length > 0 && categories.map((category, idx) => (
                            <tr key={idx}>
                                <td>
                                    {category.name}
                                </td>
                                <td>
                                    {category.parent?.name}
                                </td>
                                <td>

                                    {!editMode.edit ? <>
                                        <button onClick={() => editCategory(category)}
                                            className="btn-primary mr-1">Edit</button>
                                        <button 
                                        className="btn-primary"
                                        onClick={()=> deleteCategory(category)}>
                                            Delete</button>
                                    </> : editMode.category._id === category._id ?
                                        <button onClick={cancelEdit}
                                            className="btn-primary">
                                            Cancel
                                        </button> : <div></div>
                                    }

                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </Layout>
    )
}

export default withSwal(({swal},ref) => (
    <Categories swal={swal} />
))