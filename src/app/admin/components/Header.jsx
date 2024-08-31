// components/Header.js
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <header className="flex items-center justify-between bg-gray-700 p-3">
      <div className="flex items-center">
        <button className="text-white text-xl px-2">
          {/* <FontAwesomeIcon icon={faBars} /> */}
        </button>
        <div className="flex items-center ml-4">
          {/* <Image className='rounded-full'
            src="/ali.png"
            alt="Pluto Logo"
            width={40}
            height={40}
          /> */}
          <span className="text-white text-2xl font-semibold ml-2">Store2u</span>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative text-white">
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute top-0 right-3 h-4 w-4 bg-red-500 text-xs flex items-center justify-center rounded-full">2</span>
        </div>
        <div className="relative text-white">
          <FontAwesomeIcon icon={faEnvelope} />
          <span className="absolute top-0 right-3 h-4 w-4 bg-red-500 text-xs flex items-center justify-center rounded-full">3</span>
        </div>
        <div className="flex items-center">
          {/* <Image
            src="/ali.png"
            alt="Profile Picture"
            width={40}
            height={40}
            className="rounded-full"
          /> */}
          <span className="text-white text-lg ml-2">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;