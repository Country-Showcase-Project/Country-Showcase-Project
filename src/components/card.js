import React from "react";

function handleRedirect(mapMod) {
    window.location.href = `/${mapMod}`;
}

const Card = ({ title, imageUrl, imageAlt, description, mapMod }) => {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg relative">
            <div className="relative overflow-hidden">
                <img
                    className="object-cover h-96 w-96 transition duration-500 transform hover:scale-110"
                    src={imageUrl}
                    alt={imageAlt}
                />
            </div>
            <div className="px-6 py-4 absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white">
                <div className="font-bold text-xl mb-2 text-center">
                    {title}
                    <p className="text-gray-200 text-base">{description}</p>
                    <div className="mt-4">
                        <button className="bg-gradient-to-br from-yellow-500 via-orange-500 to-blue-500 hover:bg-gradient-to-br hover:from-yellow-600 hover:via-orange-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded border border-white"
                            onClick={() => handleRedirect(mapMod)}
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;
