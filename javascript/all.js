let soundPack = [];
let soundPack_id = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 8, 8.5, 9, 9.5, 10, 11, 11.5, 12, 12.5, 13, 13.5, 14, 15];

for (let i = 0; i < soundPack_id.length; i++) {
    soundPack.push({
        num: soundPack_id[i],
        url: 'https://awiclass.monoame.com/pianosound/set/' + soundPack_id[i] + '.wav',
    })
}
let pianoData = {
    soundDate: soundPack,
    notes: [{ "num": 5, "time": 101 }, { "num": 6, "time": 145 }, { "num": 7, "time": 220 }, { "num": 8, "time": 293 }, { "num": 8, "time": 390 }, { "num": 8, "time": 431 }, { "num": 8, "time": 532 }, { "num": 8, "time": 573 }, { "num": 8, "time": 672 }, { "num": 8, "time": 715 }, { "num": 8, "time": 808 }, { "num": 8, "time": 852 }, { "num": 9, "time": 929 }, { "num": 10, "time": 959 }, { "num": 11, "time": 1078 }, { "num": 12, "time": 1133 }, { "num": 13, "time": 1404 }, { "num": 13, "time": 1501 }, { "num": 13, "time": 1606 }, { "num": 12, "time": 1672 }, { "num": 12, "time": 1808 }, { "num": 12, "time": 1901 }, { "num": 10, "time": 2034 }, { "num": 9, "time": 2094 }, { "num": 8, "time": 2188 }, { "num": 9, "time": 2293 }],
    now_note_id: 0,
    next_note_id: 0,
    playing_time: 0,
    record_time: 0,
    player: null,
    recorder: null,
    now_press_key: -1,
    display_keys: [{ num: 1, key: 90, type: 'white' },
        { num: 1.5, key: 83, type: 'black' },
        { num: 2, key: 88, type: 'white' },
        { num: 2.5, key: 68, type: 'black' },
        { num: 3, key: 67, type: 'white' },
        { num: 4, key: 86, type: 'white' },
        { num: 4.5, key: 71, type: 'black' },
        { num: 5, key: 66, type: 'white' },
        { num: 5.5, key: 72, type: 'black' },
        { num: 6, key: 78, type: 'white' },
        { num: 6.5, key: 74, type: 'black' },
        { num: 7, key: 77, type: 'white' },
        { num: 8, key: 81, type: 'white' },
        { num: 8.5, key: 50, type: 'black' },
        { num: 9, key: 87, type: 'white' },
        { num: 9.5, key: 51, type: 'black' },
        { num: 10, key: 69, type: 'white' },
        { num: 11, key: 82, type: 'white' },
        { num: 11.5, key: 53, type: 'black' },
        { num: 12, key: 84, type: 'white' },
        { num: 12.5, key: 54, type: 'black' },
        { num: 13, key: 89, type: 'white' },
        { num: 13.5, key: 55, type: 'black' },
        { num: 14, key: 85, type: 'white' },
        { num: 15, key: 73, type: 'white' }
    ],
}

let vm = new Vue({
    el: '#app',
    data: pianoData,
    mounted() {
        this.keydown();
        this.keyup();
    },
    methods: {
        playNote(id, volume) {
            let audio_obj = $('audio[data-num="' + id + '"]')[0];
            if (id > 0) {
                audio_obj.volume = volume;
                audio_obj.currentTime = 0;
                audio_obj.play();
            }
        },
        playNext(volume) {
            let play_note = this.notes[this.now_note_id].num
            this.playNote(play_note, volume);
            this.now_note_id += 1;

            if (this.now_note_id >= this.notes.length) {
                this.stopPlay();
            };
        },
        startRecord() {
            this.notes = [];
            this.record_time = 0;
            let vObj = this;
            this.recorder = setInterval(function() {
                vObj.record_time += 1;
            });
        },
        stopRecord() {
            clearInterval(this.recorder);
            this.record_time = 0;
        },
        startPlay() {
            if (this.notes.length === 0) return;
            this.now_note_id = 0;
            this.next_note_id = 0;
            this.playing_time = 0;
            let vObj = this;
            this.player = setInterval(function() {
                vObj.playing_time += 1;

                if (vObj.playing_time >= vObj.notes[vObj.next_note_id].time) {
                    vObj.playNext(1);
                    vObj.next_note_id += 1;
                };
            });
        },
        stopPlay() {
            clearInterval(this.player);
            this.now_note_id = 0;
            this.next_note_id = 0;
            this.playing_time = 0;
        },
        get_current(id, key) {
            if (this.now_press_key == key) return true;
            if (this.notes.length == 0) return false;
            if (this.playing_time == 0) return false;

            let cur_id = this.now_note_id - 1;
            if (cur_id < 0) cur_id = 0;
            let num = this.notes[cur_id].num;
            if (num == id) return true;
            return false;
        },
        addNote(id) {
            if (this.record_time > 0)
                this.notes.push({ num: id, time: this.record_time });
            this.playNote(id, 1)
        },
        load_sample() {
            let vObj = this
            $.ajax({
                url: "https://awiclass.monoame.com/api/command.php?type=get&name=music_dodoro",
                success(res) {
                    vObj.notes = JSON.parse(res);
                }
            });
        },
        clear() {
            this.notes = [];
            vm.stopPlay();
            vm.stopRecord();
        },
        keydown() {
            $(window).keydown((e) => {
                let key = e.which;

                vm.now_press_key = key;

                for (let i = 0; i < vm.display_keys.length; i++) {
                    if (key == vm.display_keys[i].key) {
                        vm.addNote(vm.display_keys[i].num);
                    }
                }
            })
        },
        keyup() {
            $(window).keyup(() => {
                vm.now_press_key = -1;
            })
        }
    }
})