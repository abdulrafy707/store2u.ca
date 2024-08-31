// components/StatsCards.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faCloudDownloadAlt, faComments } from '@fortawesome/free-solid-svg-icons';

const StatsCards = () => {
  return (
    <div className="flex space-x-4 p-4">
      <div className="bg-white shadow-md rounded-lg flex items-center p-4 w-1/4">
        <FontAwesomeIcon icon={faUser} className="text-orange-500 text-3xl" />
        <div className="ml-4">
          <div className="text-gray-800 text-xl">2500</div>
          <div className="text-gray-500">Welcome</div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg flex items-center p-4 w-1/4">
        <FontAwesomeIcon icon={faClock} className="text-blue-500 text-xl" />
        <div className="ml-4">
          <div className="text-gray-800 text-xl">123.50</div>
          <div className="text-gray-500">Average Time</div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg flex items-center p-4 w-1/4">
        <FontAwesomeIcon icon={faCloudDownloadAlt} className="text-teal-500 text-xl" />
        <div className="ml-4">
          <div className="text-gray-800 text-xl">1,805</div>
          <div className="text-gray-500">Collections</div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg flex items-center p-4 w-1/4">
        <FontAwesomeIcon icon={faComments} className="text-pink-500 text-xl" />
        <div className="ml-4">
          <div className="text-gray-800 text-xl">54</div>
          <div className="text-gray-500">Comments</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;