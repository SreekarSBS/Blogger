import { assets} from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Blogitem = ({title,description,category,image,id}) => {

    
    
  return (
    <div className='max-w-[330px] sm:max-w-[250px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000]'>
      <Link href = {`/blogs/${id}`}>
      <Image src = {image} alt ='' width ={400} height = {400} className='border-b border-black'/>
      </Link>
      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>
      <div className="p-4">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>
        <p className='mb-3 text-sm tracking-tight text-gray-700'
          dangerouslySetInnerHTML={{__html : data.description.slice(0,120)}}
        ></p>
        <Link href = {`/blogs/${id}`} className='inline-flex items-center py-2 font-semibold text-center'>
            Read More <Image src = {assets.arrow} className='mg-2' width = {12} />
        </Link>
      </div>
    </div>
  )
}

export default Blogitem
