"use client";

import React, { useState, useEffect } from 'react';

const Sidebar: React.FC<{
    songsList: { id: number; name: string; artist: string; src: string; cover: string }[];
    currentSong: number; // Adicionando currentSong como prop
    setCurrentSong: (index: number) => void;
}> = ({ songsList, currentSong, setCurrentSong }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState<number>(0); // Inicializa com 0 para a primeira música

    // Efeito para atualizar o índice da música atual quando currentSong mudar
    useEffect(() => {
        setCurrentSongIndex(currentSong); // Atualiza o índice quando a música atual mudar
    }, [currentSong]); // O efeito roda sempre que currentSong muda

    const handleSongClick = (index: number) => {
        setCurrentSong(index); // Atualiza a música atual no componente pai
    };

    return (
        <div className="sidebar">
            <h3>Playlist</h3>
            <ul id="playlist">
                {songsList.map((song, index) => (
                    <li 
                        key={song.id} 
                        className={`cursor-pointer ${currentSongIndex === index ? 'active' : ''}`} // Adicionando a classe active se a música estiver tocando
                        onClick={() => handleSongClick(index)}>
                        <div className="song-name">{song.name}</div>
                        <div className="song-artist">{song.artist}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
