import axios from "axios"

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_UPLOAD_PRESET

export const uploadService = {
  cloudUploadMany
}

async function cloudUploadOne(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  try {
    const imgUrl = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData)
    return imgUrl.data.secure_url
  }
  catch (err) {
    console.error('err while upload:', err)
  }

}

async function cloudUploadMany(files) {
  const urls = []
  for (const file of files) {
    const url = await cloudUploadOne(file)
    urls.push(url)
  }
  return urls
}
