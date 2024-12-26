import React from 'react';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-teal-600 border-solid"></div>
        </div>
    );
};

export default Loader;
