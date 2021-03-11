// Binding
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Global variables
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const PLAYER_STORAGE_KEY = 'Thanh Trung Nguyen';

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
      
    songs: [
        {
            name: 'Tình bạn diệu kỳ',
            singer: 'Amee, Ricky Star, Lăng LD',
            path: './assets/music/song1.mp3',
            img: './assets/img/img1.jpg'
        },
        {
        name: 'Nàng thơ',
        singer: 'Hoàng Dũng',
        path: './assets/music/song2.mp3',
        img: './assets/img/img2.jpg'
        },
        {
            name: 'Trên tình bạn duới tình yêu',
            singer: 'Min',
            path: './assets/music/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'Hoa nở không màu',
            singer: 'Hoài Lâm',
            path: './assets/music/song4.mp3',
            img: './assets/img/img4.jpg'
        },
        {
            name: 'Gác lại âu lo',
            singer: 'Da LAB, Miu Lê',
            path: './assets/music/song5.mp3',
            img: './assets/img/img5.jpg'
        },
        {
            name: 'Tình yêu khủng long',
            singer: 'FAY',
            path: './assets/music/song6.mp3',
            img: './assets/img/img6.jpg'
        },
        {
            name: 'Chuyện rằng',
            singer: 'Thịnh Suy',
            path: './assets/music/song7.mp3',
            img: './assets/img/img7.jpg'
        },
        {
            name: '3107 - 2 (Lofi Version)',
            singer: 'Duongg, Nâu, W/n',
            path: './assets/music/song8.mp3',
            img: './assets/img/img8.jpg'
        },
        {
            name: 'Bồ em',
            singer: 'DÍNH',
            path: './assets/music/song9.mp3',
            img: './assets/img/img9.jpg'
        },
        {
            name: 'Ghé qua',
            singer: 'Dick, Tofu, PC',
            path: './assets/music/song10.mp3',
            img: './assets/img/img10.jpg'
        }
    ],

    setConfig: function(key, value) {
        this.config[key] = value,
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ' '}" data-index="${index}">
                    <div class="thumb" style="background-image: url('${song.img}')"></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
       
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;

        // CD rotates and stops
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });

        cdThumbAnimate.pause();

        // Zoom in/out the CD
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Click play btn
        playBtn.onclick = function() {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        
        // When song plays
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        
        // When song pauses
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }

        // When song runs, progress bar runs
        audio.ontimeupdate = function() {
            if (audio.duration) {
                var progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        // When song changes timelines
        progress.onchange = function(e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        }

        // When clicks next song 
        nextBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // When clicks prev song
        prevBtn.onclick = function() {
            if (app.isRandom) {
                app.playRandomSong();
            } else {
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }

        // When random changes
        randomBtn.onclick = function() {
            // if (app.isRandom == false) {
            //     app.randomSong();
            //     app.isRandom = true;
            //     randomBtn.classList.add('active');
            // } else {
            //     app.isRandom = false;
            //     randomBtn.classList.remove('active');
            // }

            app.isRandom = !app.isRandom;
            app.setConfig('isRandom', app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        }

        // When repeat changes
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
            repeatBtn.classList.toggle('active', app.isRepeat);
        }

        // When song ended
        audio.onended = function() {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Click song on playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || !e.target.closest('.option')) {
                if (songNode) {
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }

                if (!e.target.closest('.option')) {

                }
            }
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 200);
    },
    
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },
    
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },

    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },

    playRandomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);

        } while (this.currentIndex === newIndex);
       
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        randomBtn.classList.toggle('active', app.isRandom);
        repeatBtn.classList.toggle('active', app.isRepeat);
    }
};

app.start();