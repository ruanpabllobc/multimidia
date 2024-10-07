import React, { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface Song {
    id: number;
    name: string;
    artist: string;
    src: string;
    cover: string;
}

interface MusicPlayerProps {
    currentSong: number;
    songsList: Song[];
    setCurrentSong: React.Dispatch<React.SetStateAction<number>>;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ currentSong, songsList, setCurrentSong }) => {
    const [playing, setPlaying] = useState(false);
    const [song, setSong] = useState<HTMLAudioElement | null>(null);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);

    useEffect(() => {
        if (song) {
            song.pause();
            song.currentTime = 0; // Reset only when switching songs
        }

        const newSong = new Audio(songsList[currentSong].src);
        newSong.volume = volume;
        setSong(newSong);

        const handleEnded = () => {
            setPlaying(false);
            setCurrentSong((prev) => (prev + 1) % songsList.length);
        };

        newSong.addEventListener('ended', handleEnded);

        return () => {
            newSong.pause();
            newSong.removeEventListener('ended', handleEnded);
        };
    }, [currentSong, songsList]);

    useEffect(() => {
        if (song) {
            playing ? song.play() : song.pause();

            const interval = setInterval(() => {
                setProgress((song.currentTime / song.duration) * 100);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [song, playing]);

    const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const progressBar = e.currentTarget;
        const clickX = e.clientX - progressBar.getBoundingClientRect().left;
        const newProgress = (clickX / progressBar.clientWidth) * 100;

        setProgress(newProgress);

        if (song) {
            song.currentTime = (newProgress / 100) * song.duration;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = Number(e.target.value);
        setVolume(newVolume);
        if (song) {
            song.volume = newVolume;
        }
    };

    return (
        <div className="container">
            <div className="disk">
                <div 
                    className="cover" 
                    style={{ backgroundImage: `url(${songsList[currentSong]?.cover})` }}>
                </div>
            </div>
            <div className="song-info">
                <div className="song-name">{songsList[currentSong]?.name}</div>
                <div className="artist-name">{songsList[currentSong]?.artist}</div>
            </div>

            <div className="progress-bar" onClick={handleProgressBarClick}>
                <div className="fill-bar" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="song-time">
                <span>{Math.floor((song?.currentTime || 0) / 60)}:{Math.floor((song?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
                <span>{Math.floor((song?.duration || 0) / 60)}:{Math.floor((song?.duration || 0) % 60).toString().padStart(2, '0')}</span>
            </div>
            <div className="controls">
                <button onClick={() => setCurrentSong(prev => (prev - 1 + songsList.length) % songsList.length)} className="control-btn previous-btn">
                    <FaBackward />
                </button>
                
                <button onClick={() => setPlaying(!playing)} className="control-btn play-btn">
                    {playing ? <FaPause /> : <FaPlay />}
                </button>
                
                <button onClick={() => setCurrentSong(prev => (prev + 1) % songsList.length)} className="control-btn next-btn">
                    <FaForward />
                </button>

                {/* Volume Control */}
                <div className="volume-control">
                    <button onClick={() => setShowVolumeSlider(prev => !prev)} className="control-btn volume-btn">
                        {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
                    </button>
                    {showVolumeSlider && (
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="volume-slider"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;