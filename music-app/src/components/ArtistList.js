import React, { useState, useEffect } from "react";
import axios from "axios";
import AlbumList from "./AlbumList";

const ArtistList = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(
        "https://musicapp-33en.onrender.com/api/artists"
      );
      setArtists(result.data);
      setLoading(false);
      setError(null); 
    } catch (error) {
      console.error("Error fetching artists:", error);
      setError(error);
      setLoading(false);
    }
  };

  const handleArtistClick = async (artistId) => {
    try {
      const result = await axios.get(
        `https://musicapp-33en.onrender.com/api/artists/${artistId}`
      );
      setSelectedArtist(result.data);
    } catch (error) {
      console.error("Error fetching artist details:", error);
    }
  };

  const handleReset = () => {
    setSelectedArtist(null);
    fetchData();
  };

  return (
    <div className='max-w-2xl mx-auto p-4'>
      {!selectedArtist && <h1 className='text-3xl font-bold mb-4'>Artists</h1>}
      {loading ? (
        <p className='text-gray-600'>Loading...</p>
      ) : error ? (
        <p className='text-red-600'>Error fetching data: {error.message}</p>
      ) : (
        <>
          {selectedArtist ? (
            <div className='border-b-2 pb-4 mb-4 text-center'>
              <h2 className='text-2xl font-bold mb-2 bg-gray-300 rounded-xl py-2 px-4 inline-block'>
                Artist: {selectedArtist.name}
              </h2>
              <AlbumList
                artistId={selectedArtist._id}
                selectedArtist={selectedArtist}
              />
            </div>
          ) : (
            <ul className='divide-y divide-gray-200'>
              {artists.map((artist) => (
                <li
                  key={artist._id}
                  className={`py-4 cursor-pointer hover:bg-gray-100 ${
                    selectedArtist && selectedArtist._id === artist._id
                      ? "border border-gray-400 rounded-lg"
                      : ""
                  }`}
                  onClick={() => handleArtistClick(artist._id)}>
                  <h2 className='text-xl font-bold'>{artist.name}</h2>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
      <button
        className='mt-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-md shadow-md  hover:bg-gray-400'
        onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default ArtistList;
