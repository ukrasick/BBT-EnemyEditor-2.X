// メニュータブ制御
const tabmenu = Vue.createApp({
    data() {
        return {
            tabdata: ["data_input", "chatpalette", "udonarium", "ccfolia", "old_converter", "history"],
            tabname: {
                data_input: "データ入力",
                chatpalette: "チャットパレット",
                udonarium: "ユドナリウム駒出力",
                ccfolia: "ココフォリア駒出力",
                old_converter: "旧エディタ変換",
                history: "更新履歴"
            }
        };
    },
    mounted() {
        for (let k of this.tabdata) {
            let m = document.getElementById(`menu_${k}`);
            m.classList.add("tabmenu_button", "w3-container", "w3-border-top", "w3-border-left", "w3-border-right", "w3-hover-blue");
        }
       this.tab_select("data_input");
    },
    methods: {
        tab_select(key) {
            for (let k of this.tabdata) {
                let sec = document.getElementById(`tab_${k}`);
                let m = document.getElementById(`menu_${k}`);
                if(!sec || !m) { continue; }
                if( k == key ) {
                    sec.style.display = "block";
                    m.classList.add("w3-indigo", "w3-border-indigo", "tab_selected");
                    m.classList.remove("w3-hover-blue");
                } else {
                    sec.style.display = "none";
                    m.classList.remove("w3-indigo", "w3-border-indigo", "tab_selected");
                    m.classList.add("w3-hover-blue");
                }
            }
        }
    }
});
const etm = tabmenu.mount("#tabmenu");

// エネミー基本情報
const eetable = Vue.createApp({
    data() {
        return {
            baseabl: ["肉体", "技術", "感情", "加護", "社会"],
            battleabl: ["白兵", "射撃", "回避", "行動"],
            otherabl: ["ＦＰ", "アーマー", "ガード", "レベル"],
            kind: ["人間", "吸血", "来訪", "精霊", "神聖", "魔界", "亜人", "機械", "概念", "邪神", "怪獣", "巨大"],
            category: ["ドミネーター", "使徒", "軍団武器装備", "クラード"],
            base_info: {
                name: "",
                appearance: "",
                checked_kinds: [],
                checked_categories: [],
                note: ""
            },
            base_params: {
                abl: {"肉体":0, "技術":0, "感情":0, "加護":0, "社会":0},
                mod: {"肉体":0, "技術":0, "感情":0, "加護":0, "社会":0},
                amr: {"肉体":0, "技術":0, "感情":0, "加護":0, "社会":0},
                edr: {"肉体":1, "技術":1, "感情":1, "加護":1, "社会":1}
            },
            battle_params: {
                abl: {"白兵":0, "射撃":0, "回避":0, "行動":0},
                mod: {"白兵":0, "射撃":0, "回避":0, "行動":0},
                otr: {"ＦＰ":0, "アーマー":0, "ガード":0, "レベル":0}
            }
        };
    },
    methods: {
        data_load(obj) {
            let a = obj.data.enemy_base.info;
            if(a) {
                for(let k of Object.keys(this.base_info)) {
                    if(a[k]) {
                        if(["name", "appearance", "note"].includes(k) && typeof a[k] != "string") { continue; }
                        if(["checked_kinds", "checked_categories"].includes(k)) { if(!Array.isArray(a[k])) { continue; } }
                        this.base_info[k] = a[k];
                    }
                }
            }
            let b = obj.data.enemy_base.base_params;
            if(b) {
                for(let k of Object.keys(this.base_params)) {
                    for(let j of ["肉体", "技術", "感情", "加護", "社会"]) {
                        if(b[k][j]) {
                            if(typeof b[k][j] != "number") { continue; }
                            this.base_params[k][j] = b[k][j];
                        }
                    }
                }
            }
            let c = obj.data.enemy_base.battle_params;
            if(c) {
                if(c.abl) {
                    for(let j of ["白兵", "射撃", "回避", "行動"]) {
                        if(c.abl[j]) {
                            if(typeof c.abl[j] != "number") { continue; }
                            this.battle_params.abl[j] = c.abl[j];
                        }
                    }
                }
                if(c.mod) {
                    for(let j of ["白兵", "射撃", "回避", "行動"]) {
                        if(c.mod[j]) {
                            if(typeof c.mod[j] != "number") { continue; }
                            this.battle_params.mod[j] = c.abl[j];
                        }
                    }
                }
                if(c.otr) {
                    for(let j of ["ＦＰ", "アーマー", "ガード", "レベル"]) {
                        if(c.otr[j]) {
                            if(typeof c.otr[j] != "number") { continue; }
                            this.battle_params.otr[j] = c.otr[j];
                        }
                    }
                }
            }
        }
    }
});
const eet = eetable.mount("#ee_table_base");

// 通常アーツ一覧
const ee_arts = Vue.createApp({
    data() {
        return {
            dataheader: ["名称", "種別", "LV", "タイミング", "判定値", "対象", "射程", "効果", "LV表示"],
            items: []
        };
    },
    mounted() {
        this.new_line();
    },
    methods: {
        data_template() {
            return {name: "", kind: "", level: "", timing: "", judge: "", tgt: "", range: "", note: "", disptype: "表示"};
        },
        data_load(obj) {
            let a = obj.data.arts;
            if(a) {
                this.items.splice(0, this.items.length);
                for(let k of a) { this.add_line(k); }
            }
        },
        add_line(obj) {
            let data = this.data_template();
            let keys = Object.keys(data);
            if(obj){
                for (let k of keys) { if(obj[k]) { data[k] = obj[k]; } }
            }
            this.items.push(data);
        },
        new_line() {
            let data = this.data_template();
            this.items.push(data);
        },
        delete_line(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                this.items.splice(i-1, 1);
            }
        },
        upward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.items.splice(i-1, 1);
                this.items.splice(i-2, 0, c);
            }
        },
        downward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == table.length - 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.items.splice(i-1, 1);
                this.items.splice(i, 0, c);
            }
        },
        header_align(header) {
            return ["名称", "種別", "効果"].includes(header) ? "left" : "center";
        }
    }
});
const eta = ee_arts.mount("#ee_table_arts");

// ドミニオンアーツ一覧
const ee_d_arts = Vue.createApp({
    data() {
        return {
            dataheader: ["名称", "種別", "LV", "タイミング", "判定値", "対象", "射程", "効果", "LV表示"],
            items: [],
            darts_book: ["ピックアップ", "基本ルールブック", "ディケイド", "ドミニオンズ", "アドヴェント"],
            select_dart_list: "世界律：神速",
            select_dart_book: "ピックアップ",
            select_dart_category: "汎用",
            dart_level: 1,
            dart_level_disp: "隠蔽",
            dart_search_type: "汎用"
        };
    },
    methods: {
        data_template() {
            return {name: "", kind: "", level: "", timing: "", judge: "", tgt: "", range: "", note: "", disptype: "表示"};
        },
        data_load(obj) {
            let a = obj.data.d_arts;
            if(a) {
                this.items.splice(0, this.items.length);
                for(let k of a) { this.add_line(k); }
            }
        },
        add_line(obj) {
            let data = this.data_template();
            let keys = Object.keys(data);
            if(obj){
                for (let k of keys) { if(obj[k]) { data[k] = obj[k]; } }
            }
            this.items.push(data);
        },
        new_line() {
            let data = this.data_template();
            this.items.push(data);
        },
        delete_line(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                this.items.splice(i-1, 1);
            }
        },
        upward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.items.splice(i-1, 1);
                this.items.splice(i-2, 0, c);
            }
        },
        downward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == table.length - 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.items.splice(i-1, 1);
                this.items.splice(i, 0, c);
            }
        },
        add_darts() {
           let data = this.data_template();
           let n = this.select_dart_list;
           if(!n) { return; }
           let v = this.dart_level, d = this.dart_level_disp,  o = DOMINION_ARTS_DICT[n];
           Object.assign(data,{ name: n, kind: o.kind, level: Math.min(v, o.level), timing: o.timing, tgt: o.tgt, range: o.range, disptype: d });
           if(data) { this.items.push(data); }
        },
        darts_levels() {
            let result = 0;
            for(let i of this.items) {
                if(!i || !i.level) { continue; }
                result += parseInt(i.level) * (i.kind.match(/[DＤ]エゴ/) ?  2 : 1);
            }
            return result;
        },
        dart_book_category() {
            return Object.keys(DOMINION_ARTS_LIST[this.select_dart_book]);
        },
        change_dart_list() {
            // 書籍選択後、選択カテゴリを調整
            if(!this.dart_book_category().includes(this.select_dart_category)) {
                this.select_dart_category = this.dart_book_category()[0];
            }
            // リストの選択済みデータを調整
            this.select_dart_list = DOMINION_ARTS_LIST[this.select_dart_book][this.select_dart_category][0];
        },
        header_align(header) {
            return ["名称", "種別", "効果"].includes(header) ? "left" : "center";
        }
    },
    computed: {
        level_amount() {
            let result = 0;
            for(let i of this.items) {
                if(!i) { continue; }
                if(!i.level) { continue; }
                result += i.kind.match(/[DＤ]エゴ/) ? parseInt(i.level) * 2 : parseInt(i.level);
            }
            return result;
        },
        darts_list() {
            return DOMINION_ARTS_LIST[this.select_dart_book][this.select_dart_category];
        },
        allow_dart() {
            return this.select_dart_list ? false : true;
        }
    }
});
const eda = ee_d_arts.mount("#ee_table_d_arts");

// ダメージロール一覧
const ee_damagerolls = Vue.createApp({
    data() {
        return {
            dataheader: ["名称", "種別", "命中", "属性", "ダメージ", "対象", "射程", "効果・備考", "表示"],
            items: [],
        };
    },
    mounted() {
        this.new_line();
    },
    methods: {
        data_template() {
            return {name: "", kind: "", hit: "", attribute: "肉体", damage: "", tgt: "", range: "", note: "", disp: false};
        },
        data_load(obj) {
            let a = obj.data.damagerolls;
            if(a) {
                this.items.splice(0, this.items.length);
                for(let k of a) { this.add_line(k); }
            }
        },
        add_line(obj) {
            let data = this.data_template();
            let keys = Object.keys(data);
            if(obj){
                for (let k of keys) { if(obj[k]) { data[k] = obj[k]; } }
            }
            this.items.push(data);
        },
        new_line() {
            let data = this.data_template();
            this.items.push(data);
        },
        delete_line(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                this.items.splice(i-1, 1);
            }
        },
        upward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.items.splice(i-1, 1);
                this.items.splice(i-2, 0, c);
            }
        },
        downward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == table.length - 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.items.splice(i-1, 1);
                this.items.splice(i, 0, c);
            }
        },
        header_align(header) {
            return ["名称", "種別", "命中", "ダメージ", "効果・備考"].includes(header) ? "left" : "center";
        }
    }
});
const edr = ee_damagerolls.mount("#ee_table_damagerolls");

// データの保存
const ee_data_save = Vue.createApp({
    methods: {
        output_data() {
            let json = {
                enemy_base: {
                    info: eet.base_info,
                    base_params: eet.base_params,
                    battle_params: eet.battle_params
                },
                d_arts: eda.items,
                arts: eta.items,
                damagerolls: edr.items
            };
            return JSON.parse(JSON.stringify(json));
        },
        download_json() {
            let json = {
                attestation: "EnemyEditor2-for-BBT",
                data: {
                    enemy_base: {
                        info: eet.base_info,
                        base_params: eet.base_params,
                        battle_params: eet.battle_params
                    },
                    d_arts: eda.items,
                    arts: eta.items,
                    damagerolls: edr.items
                }
            };
            let name = json.data.enemy_base.info.name;
            let j = JSON.stringify(json);
            const blob = new Blob([j], {type: 'application\/json'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = name ? name : "EnemyEditor2" + ".json";
            link.click();
            URL.revokeObjectURL(url);
        }
    }
});
const eds = ee_data_save.mount("#ee_data_save");

// データの読み込み
const ee_data_load = Vue.createApp({
    data() {
        return {
            message: ""
        };
    },
    methods: {
        load_json(e) {
            let file = e.target.files[0];
            if(!file) {
                this.message = "正しくファイルが読み込まれていません。";
                return;
            }
            if(!file.type.match("application/json")) {
                this.message = "jsonファイルを読み込んでください。";
                return;
            }
            let reader = new FileReader();
            reader.readAsText(file);

            reader.onload = () => {
                if(!reader.result) {
                    this.message = "正しくファイルが読み込まれていません。";
                    return;
                }
                let data = JSON.parse(reader.result);
                console.log(data);
                if(!data.attestation) {
                    this.message = "Enemy Editor 2のファイルではありません。";
                    return;
                }
                if(data.attestation !== "EnemyEditor2-for-BBT") {
                    this.message = "Enemy Editor 2のファイルではありません。";
                    return;
                }
                eet.data_load(data);
                eta.data_load(data);
                eda.data_load(data);
                edr.data_load(data);
                // データの読み込みが終了したら、ファイルの破棄を試みる
                document.form_data_load.reset();
                // データの読み込みを行った場合、チャットパレットとココフォリア駒データをリセット
                eec.result = "";
                ecca.output = "";
            };
            reader.onerror = () => {
                this.message = "ファイルが正しく読み込まれませんでした。";
                return;
            };
        }
    }
});
const edl = ee_data_load.mount("#ee_data_load");