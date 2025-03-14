import {assets} from '../assets/assets'
import {useNavigate} from 'react-router-dom'
const Footer = () => {
  const navigate = useNavigate()
  return (
    <div className='md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
        {/* left section*/}
        <div>
          <img className='mb-5 w-40' src={assets.logo} alt="" />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'> consectetur quaerat ad voluptatem natus, nesciunt voluptates repudiandae nemo labore quidem consectetur, cum magnam laboriosam atque minus! Excepturi repellendus impedit harum quidem voluptas libero.</p>
        </div>
        {/* center section*/}
        <div>
          <p className='text-xl font-medium mb-5'>COMPANY</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li onClick={()=> {navigate('/');window.scrollTo({ top: 0, behavior: 'smooth' });}} className='cursor-pointer'>Home</li>
            <li onClick={()=> {navigate('/about');window.scrollTo({ top: 0, behavior: 'smooth' });}} className='cursor-pointer'>About Us</li>
            <li onClick={()=> {navigate('/contact');window.scrollTo({ top: 0, behavior: 'smooth' });}} className='cursor-pointer'>Contact Us</li>
            <li onClick={()=> {navigate('/privacy');window.scrollTo({ top: 0, behavior: 'smooth' });}} className='cursor-pointer'>Privacy Policy</li>
          </ul>
        </div>
        {/* right section*/}
        <div>
          <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
          <ul className='flex flex-col gap-2 text-gray-600'>
            <li>+1-212-456-7890</li>
            <li>laxkaraditya55@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        {/*copyright text */}
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ prescripto - All Rights Reserved.</p>
      </div>
    </div>
  )
}

export default Footer
