const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'ENVIDI_PLAYER'

const player = $('.player');
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const timeAudioLeft = $('.time-audio-left')
const timeAudioRight = $('.time-audio-right')

const volumeBar = $(".ctrl__volume--value");
const volumeUp = $(".volume__icon");
const volumeMute = $(".mute");
let theVolume = 100;

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {          
            name: 'Anh Đã Quen Với Cô Đơn',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/AnhDaQuenVoiCoDon-SoobinHoangSon-4821170.mp3',
            image: './assets/img/anhdaquenvoicodon.jpg'
        },
        {          
            name: 'ChillnFree | Anhs & Ems',
            singer: 'QNT x RZMAS x WXRDIE (Prod. by RASTZ)',
            path: './assets/music/Anhs Ems - QNT_ RZ Ma__ Wxrdie.mp3',
            image: './assets/img/anhsems.jfif'
        },
        {          
            name: 'Có hẹn với thanh xuân',
            singer: 'MONSTAR ',
            path: './assets/music/Co Hen Voi Thanh Xuan - Monstar.mp3',
            image: './assets/img/cohenvoitx.jpg'
        },
        {          
            name: 'Đi Về Nhà',
            singer: 'Đen x JustaTee',
            path: './assets/music/di ve nha.mp3',
            image: './assets/img/loi-bai-hat-di-ve-nha.jpg'
        },
        {          
            name: 'Dòng thời gian',
            singer: 'Nguyễn Hải Phong',
            path: './assets/music/Dong Thoi Gian - Nguyen Hai Phong.mp3',
            image: './assets/img/dongthoigian.jpg'
        },
        {          
            name: 'Làm gì phải Hốt',
            singer: 'JustaTee x Hoàng Thùy Linh x Đen',
            path: './assets/music/LamGiPhaiHot-JustaTeeDenHoangThuyLinh-6198647.mp3',
            image: './assets/img/lamgiphaihot.jfif'
        },
        {          
            name: 'Tết Đong Đầy',
            singer: 'KHOA x Kay Tran x Duck V',
            path: './assets/music/Tet Dong Day - Kay Tran_ Nguyen Khoa.mp3',
            image: './assets/img/tetdongday.jpg'
        },
        {          
            name: 'Tết này con sẽ về',
            singer: 'BÙI CÔNG NAM',
            path: './assets/music/Tet Nay Con Se Ve - Bui Cong Nam.mp3',
            image: './assets/img/tetnayconseve.jpg'
        },
        {          
            name: 'Thu Cuối',
            singer: 'Mr.T ft Yanbi & Hằng Bingboong',
            path: './assets/music/Thu Cuoi - Yanbi_ Mr_T_ Hang BingBoong.mp3',
            image: './assets/img/thucuoi.jpg'
        },
        {          
            name: 'Từ Ngày Em Đến',
            singer: 'Da LAB',
            path: './assets/music/Tu Ngay Em Den - Da LAB.mp3',
            image: './assets/img/tungayemden.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render:function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
          get: function () {
            return this.songs[this.currentIndex];
          }
        });
      },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg' }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth =cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth

        }
        //Xử lý khi click play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        // Khi song được play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Xử lý time audio
        audio.onloadedmetadata = function () {
            const floorDura = Math.floor(audio.duration)
            const second = floorDura % 60
            const minute = (floorDura - second) / 60
            const timeAudio = minute + ':' + second
            if(minute < 10) {
                timeAudioRight.textContent = '0' + timeAudio
    
            }
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
                timeAudioLeft.textContent = _this.SetTimeChangeAudio(Math.floor(audio.currentTime))
            }
        }

        // Xử lý khi tua bài hát
        progress.oninput = function(e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next bài hát
        nextBtn.onclick = function () {
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi prev bài hát
        prevBtn.onclick = function () {
            if(_this.isRandom){
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý Random bật /tắt bài hát
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại một bài hát
        repeatBtn.onclick = function(e) {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                // Xử lý khi click vào bài hát
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                // Xử lý khi click vào option bài hát
                if(e.target.closest('.option')) {

                }
            }
        }
    },
    SetTimeChangeAudio: function (val) {
       let minute = Math.floor(val / 60);
       let second = Math.floor(val - minute * 60);

        if(minute < 10) {
            minute = `0${minute}`;
        }
        if(second < 10){
            second = `0${second}`;
        }
        return `${minute}:${second}`;
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'end'
            })
        }, 300)
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex>=this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function() {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.render();
        this.loadCurrentSong();
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start();

