import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

const URL = '/api/categories'

function Categories({ swal }) {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState([])
    const [parentCategory, setParentCategory] = useState('')
    const [editMode, setEditMode] = useState({ category: {}, edit: false })
    const [properties, setProperties] = useState([])

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
        const data = { name,
            parentCategory,
            properties:properties.map(p => ({
                name:p.name,
                values:p.values.split(','),
            })), 
        }
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
        setProperties(categoryToUpdate.properties.map(({name,values})=>(
           {name,
            values:values.join(',')
           } 
        )))
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: `Do you want to Delete ${category.name}?`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Delete!',
            confirmButtonColor: '#d55',
            reverseButtons: true
        }).then(async result => {
            if (result.isConfirmed) {
                const { _id } = category
                await axios.delete(URL + '?_id=' + _id)
                getCategories()
            }
        })
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }]
        })
    }

    function handlePropertyNameChange(idx, property, newName) {
        setProperties(prev => {
            const properties = [...prev]
            properties[idx].name = newName
            return properties
        })
    }

    function handlePropertyValuesChange(idx, property, newValues) {
        setProperties(prev => {
            const properties = [...prev]
            properties[idx].values = newValues
            return properties
        })
    }

    function removeProperty(idxToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIdx) => {
                return pIdx !== idxToRemove
            })
        })
    }

    function cancelEdit() {
        setName('')
        setParentCategory('')
        setEditMode({ category: {}, edit: false })
        setProperties([])
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editMode.edit ? `Edit category ${editMode.category.name}` : 'Create NEW category'}</label>
            <form onSubmit={saveCategory}>
                <div className="flex gap-1">
                    <input type="text"
                        placeholder="Category name"
                        onChange={e => setName(e.target?.value)}
                        value={name} />
                    <select
                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}>
                        <option value=''>No parent category</option>
                        {
                            categories.length && categories.map((category, idx) => (
                                <option key={idx} value={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block">Properties</label>
                    <button type="button"
                        className="btn-default text-sm mb-2"
                        onClick={addProperty}
                    >Add New properties
                    </button>
                    {properties.length > 0 && properties.map((property, idx) => (
                        <div key={idx} className="flex gap-1 mb-2">
                            <input type="text"
                                className="mb-0"
                                value={property.name}
                                onChange={(e) => handlePropertyNameChange(idx, property, e.target.value)}
                                placeholder="property name (example: color)" />
                            <input type="text"
                                className="mb-0"
                                value={property.values}
                                onChange={(e) => handlePropertyValuesChange(idx, property, e.target.value)}
                                placeholder="values, comma separated" />
                            <button type="button" onClick={() => removeProperty(idx)} className="btn-default">Remove</button>
                        </div>
                    ))}
                </div>
                <div className="flex gap-1">
                    {editMode.edit &&
                        <button type="button" onClick={cancelEdit}
                            className="btn-default">
                            Cancel
                        </button>
                    }
                    <button type="submit" className="btn-primary">Save</button>
                </div>

            </form>
            {
                !editMode.edit && (
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
                                            <button onClick={() => editCategory(category)}
                                                className="btn-primary mr-1">Edit</button>
                                            <button
                                                className="btn-primary"
                                                onClick={() => deleteCategory(category)}>
                                                Delete</button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }

        </Layout>
    )
}

export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
))