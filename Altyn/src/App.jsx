import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const audioRef = useRef(null)
  const lyricsContainerRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const lyrics = [
    [0, ""],
    [3, "От Абылайхана"],
    [10, ""],
  
    [32, "Давай мы убежим"],
    [36, "Вдвоём на край земли"],
    [39, "Никто и никогда"],
    [42, "Нас не найдет"],
    [46, "Искал тебя в других"],
    [50, "Но мне нужна лишь ты"],
    [53.3, "Как солнце и луна"],
  
    [58.5, "Словно приливы океану"],
    [62, "Словно небу облака"],
    [65, "Словно грешным душам ангел"],
    [69, "Ты нужна мне"],
    [70.5, "Ты нужна"],
  
    [73, "Как для безумца наказание"],
    [76, "Как цветку нужна вода"],
    [80, "Словно смелость для признаний"],
    [83, "Ты нужна мне"],
    [84, "Ты нужна"],
  
    [87, "Возьми, меня возьми"],
    [92, "К себе на один миг"],
    [95, "И я продлю его"],
    [97.5, "Хоть навсегда"],
    [102, "Плевать на остальных"],
    [105, "Я здесь"],
    [107, "Пока здесь ты"],
    [109, "Три слова на губах"],
    [112, "Ты мне нужна"],
  
    [115, "Словно приливы океану"],
    [118, "Словно небу облака"],
    [121, "Словно грешным душам ангел"],
    [125, "Ты нужна мне"],
    [127, "Ты нужна"],
  
    // продолжение
    [129, "Как для безумца наказание"],
  [132, "Как цветку нужна вода"],
  [135, "Словно смелость для признаний"],
  [139, "Ты нужна мне"],
  [141, "Ты нужна"],

  [144, "Ты нужна для меня как день"],
  [147, "Ты нужна для меня как ночь"],
  [150, "Ты нужна для меня как свет"],
  [153, "Ты нужна как жизнь"],
  [155, "Ты нужна как воздух"],

  [158, "Ты нужна для меня как день"],
  [161, "Ты нужна для меня как ночь"],
  [164.2, "Ты нужна для меня как свет"],
  [167.2, "Ты нужна как жизнь"],
  [169, "Ты нужна как воздух"],

  [171, "Словно приливы океану"],
  [174, "Словно небу облака"],
  [177, "Словно грешным душам ангел"],
  [181, "Ты нужна мне"],
  [183, "Ты нужна"],

  [185, "Как для безумца наказание"],
  [187.5, "Как цветку нужна вода"],
  [191, "Словно смелость для признаний"],
  [195, "Ты нужна мне"],
  ];
  

  const getCurrentLyric = () => {
    for (let i = lyrics.length - 1; i >= 0; i--) {
      if (currentTime >= lyrics[i][0]) {
        return i
      }
    }
    return 0
  }

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX
    const percent = (clientX - rect.left) / rect.width
    audioRef.current.currentTime = percent * duration
  }

  const handleTouchSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const touch = e.touches[0] || e.changedTouches[0]
    const percent = (touch.clientX - rect.left) / rect.width
    audioRef.current.currentTime = Math.max(0, Math.min(duration, percent * duration))
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    const audio = audioRef.current
    
    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    
    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const currentLyricIndex = getCurrentLyric()
  const prevLyricIndexRef = useRef(currentLyricIndex)

  // Автоскролл к активной строке
  useEffect(() => {
    const container = lyricsContainerRef.current
    if (!container) return
    
    // Проверяем, действительно ли индекс изменился
    if (prevLyricIndexRef.current === currentLyricIndex) return
    prevLyricIndexRef.current = currentLyricIndex
    
    const activeLyric = container.querySelector('.lyric-line.active')
    
    if (activeLyric) {
      const containerRect = container.getBoundingClientRect()
      const lyricRect = activeLyric.getBoundingClientRect()
      
      // Проверяем, нужна ли прокрутка (если элемент уже в видимой области)
      const isInView = 
        lyricRect.top >= containerRect.top + 100 &&
        lyricRect.bottom <= containerRect.bottom - 100
      
      if (!isInView) {
        const offset = lyricRect.top - containerRect.top - (containerRect.height / 2) + (lyricRect.height / 2)
        
        container.scrollTo({
          top: container.scrollTop + offset,
          behavior: 'smooth'
        })
      }
    }
  }, [currentLyricIndex])

  return (
    <div className="player-container">
      <div className="background-gradient"></div>
      
      <div className="player-content">
        <div className="header">
          <h1 className="title">Для моей любимой 💕</h1>
          <p className="subtitle">M'Dee - Нужна</p>
        </div>

        <div className="lyrics-section" ref={lyricsContainerRef}>
          {lyrics.map((lyric, index) => (
            <div
              key={index}
              className={`lyric-line ${index === currentLyricIndex ? 'active' : ''} ${
                index < currentLyricIndex ? 'past' : ''
              }`}
            >
              {lyric[1]}
            </div>
          ))}
        </div>

        <div className="player-controls">
          <div className="progress-section">
            <span className="time-label">{formatTime(currentTime)}</span>
            <div 
              className="progress-bar" 
              onClick={handleSeek}
              onTouchStart={handleTouchSeek}
              onTouchMove={handleTouchSeek}
            >
              <div 
                className="progress-fill" 
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="progress-dot"></div>
              </div>
            </div>
            <span className="time-label">{formatTime(duration)}</span>
          </div>

          <div className="buttons">
            <button onClick={togglePlay} className="play-btn">
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"/>
                  <rect x="14" y="4" width="4" height="16" rx="1"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        <audio ref={audioRef} src="/M'Dee - Нужна.mp3" />
      </div>
    </div>
  )
}

export default App
