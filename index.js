const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAY_STORAGE_KEY = 'Trieu_Man'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')

const cd = $('.cd')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const playlist = $('.playlist')

const progress = $('#progress')

const nextSong = $('.btn-next')
const prevSong = $('.btn-prev')

const randomBtn = $('.btn-random')

const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat:false,
    config:JSON.parse(localStorage.getItem(PLAY_STORAGE_KEY)) || {},
    songs:[
        {
            name: 'Rời bỏ',
            singer: 'Hòa Minzy',
            path: './assets/music/roi_bo.mp3',
            img: './assets/img/maxresdefault.jpg'
        },
        {
            name: 'Vì yêu cứ đâm đầu',
            singer: 'Min',
            path: './assets/music/viyeucudamdau.mp3',
            img: './assets/img/viyeu.jpg'
        },
        {
            name: 'a b c d x y z n m a s a d',
            singer: 'W/N',
            path: './assets/music/a b c d.mp3',
            img: './assets/img/2 4.jpg'
        },
        {
            name: 'Mantra',
            singer: 'Jennie',
            path: './assets/music/mantra.mp3',
            img: './assets/img/mantra.webp'
        },
        {
            name: 'Qua cầu gió bay',
            singer: 'OST Cám',
            path: './assets/music/quacau.mp3',
            img: './assets/img/quacau.jpg'
        },
        {
            name: 'Odoriko',
            singer: 'Vaundy',
            path: './assets/music/odoriko.mp3',
            img: './assets/img/oki.jpg'
        },
        {
            name: 'Nhắn nhủ',
            singer: 'Ronboogz',
            path: './assets/music/nhannhu.mp3',
            img: './assets/img/nhannhu.jpg'
        },
        {
            name: 'Dept - Van Gogh',
            singer: 'Ashley Alish',
            path: './assets/music/dept.mp3',
            img: './assets/img/dept.jpg'
        },
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAY_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('\n');
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    //xu ly su kien 
    handleEvent: function(){
        const _this = this;
        const cWidth = cd.offsetWidth //lay ra chieu mac dinh cua no
        
        // xu ly cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)' // quay 360 do
            }
        ], {// quay nhu nao
            duration: 15000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();
        

        //su kien keo xuong
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdwidth = cWidth - scrollTop;
            if (newCdwidth <= 0){
                cd.style.width = 0;
                cd.style.opacity = 0;
            }
            else{
                cd.style.width = newCdwidth + 'px';
                cd.style.opacity = newCdwidth/cWidth;
            }
            
            // cd.style.opacity = newCdwidth/cWidth;
            
        };

        // xu ly khi play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }else{
                audio.play();
            }
        }
        //xu ly trang thai khi dang chay
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };

        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        //khi thay doi thanh chay 
        audio.ontimeupdate = function(){//thay doi thoi gian mac dinh
            if(audio.duration){ //thoi gian cua mp3 do, ban dau no la NaN
                const currentprogress = Math.floor((audio.currentTime / audio.duration) * 500);
                progress.value = currentprogress;
            }
        };

        //xu ly khi tua(khi co su thay doi xay ra)
        progress.onchange = function(e){
            const seekTime = (audio.duration / 500) * e.target.value;
            audio.currentTime = seekTime;
            //chay den gia tri giay thoai man
        };

        //khi bam next va prev
        nextSong.onclick = function(){
            if(_this.isRandom){
                _this.playRandom();
            }else{
                app.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        prevSong.onclick = function(){
            if(_this.isRandom){
                _this.playRandom();
            }else{
            app.prevSong();
        }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();

        }

        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        //xu ly khi bam quay lai
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);

        }

        //xu ly khi bai hat ket thuc
        audio.onended = function(){
            if (_this.isRepeat){

            }else{
                if(_this.isRandom){
                    _this.playRandom();
                }
                else{
                    app.nextSong();
                }
            }
            app.render();
            audio.play();

        }

        //xu ly th bam vao 1 bai hat 
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)');
            
            if(songNode || !e.target.closest('.option')){
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    // app.scrollToActiveSong();
                    audio.play();
                }
                if(!e.target.closest('.option')){
                    // xu ly khi click vao option
            
                    
                }
            }
        }
    
    },
    // xu ly chay toi bai hat dang duoc chieu
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'end'
            });
        },300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path
    },
    loadConfig: function(){ 
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },

    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandom: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start:function(){
        this.loadConfig();
        // gan cau hinh tu config vao ung dung

        //dinh nghia cac thuoc tinh object
        this.defineProperties();

        //lang nghe
        this.handleEvent();

        //tai thong tin bai hat dau tien
        this.loadCurrentSong()

        //render playlist
        this.render();

        randomBtn.classList.toggle('active', _this.isRandom);
        repeatBtn.classList.toggle('active', _this.isRepeat);
        
    }
}

app.start();