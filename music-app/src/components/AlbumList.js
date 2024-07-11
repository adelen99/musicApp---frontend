import React, { useState, useEffect } from "react";
import axios from "axios";

const AlbumList = ({ artistId }) => {
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [errorAlbums, setErrorAlbums] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null); // State to hold selected album
  const [albumSongs, setAlbumSongs] = useState([]);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const [errorSongs, setErrorSongs] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10); // Initial limit for displayed songs

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoadingAlbums(true);
        const response = await axios.get(
          `https://musicapp-33en.onrender.com/api/artists/${artistId}`
        );
        setAlbums(response.data.albums);
        setLoadingAlbums(false);
      } catch (error) {
        console.error("Error fetching albums:", error);
        setErrorAlbums(error);
        setLoadingAlbums(false);
      }
    };

    fetchAlbums();
  }, [artistId]);

  useEffect(() => {
    const fetchSongs = async () => {
      if (selectedAlbum) {
        try {
          setLoadingSongs(true);
          const response = await axios.get(
            `https://musicapp-33en.onrender.com/api/artists/${artistId}/songs`
          );
          setAlbumSongs(response.data);
          setLoadingSongs(false);
        } catch (error) {
          console.error("Error fetching songs:", error);
          setErrorSongs(error);
          setLoadingSongs(false);
        }
      }
    };

    fetchSongs();
  }, [selectedAlbum, artistId]);

  const handleAlbumClick = (album) => {
    setSelectedAlbum(album);
    setDisplayLimit(10);
  };

  const handleLoadMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + 10);
  };

  return (
    <div className='mt-4'>
      <h2 className='text-2xl font-bold mb-4'>Albums:</h2>
      {loadingAlbums ? (
        <p className='text-gray-600'>Loading albums...</p>
      ) : errorAlbums ? (
        <p className='text-red-600'>
          Error fetching albums: {errorAlbums.message}
        </p>
      ) : (
        <ul className='divide-y divide-gray-200 rounded-xl'>
          {albums.map((album) => (
            <li
              key={album._id}
              className={`py-2 cursor-pointer font-bold  ${
                selectedAlbum === album ? "bg-gray-200 " : ""
              }`}
              onClick={() => handleAlbumClick(album)}>
              {album.title}{" "}
              <span className='flex font-semibold'>{album.description}</span>
            </li>
          ))}
        </ul>
      )}
      {selectedAlbum && (
        <div className='mt-4'>
          <h2 className='text-2xl font-bold mb-4'>Songs:</h2>
          {loadingSongs ? (
            <p className='text-gray-600'>Loading songs...</p>
          ) : errorSongs ? (
            <p className='text-red-600'>
              Error fetching songs: {errorSongs.message}
            </p>
          ) : (
            <>
              <ul className='divide-y divide-gray-200'>
                {albumSongs.slice(0, displayLimit).map((song) => (
                  <li key={song._id} className='py-2'>
                    <span className='font-semibold'>{song.title}</span> -{" "}
                    {song.length}
                  </li>
                ))}
              </ul>
              {albumSongs.length > displayLimit && (
                <button
                  className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600'
                  onClick={handleLoadMore}>
                  Load more songs
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AlbumList;
