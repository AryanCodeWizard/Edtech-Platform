import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      {/* Section 1 */}
      <div className="mx-auto mt-16 p-1 rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all duration-200 hover:scale-95 w-fit">
        <Link to="/signup">
          <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 text-white">
            <p>Become an Instructor</p>
            <FaArrowRight />
          </div>
        </Link>
      </div>

      {/* Section 2 */}

      {/* Section 3 */}

      {/* Footer */}
    </div>
  );
};

export default Home;
