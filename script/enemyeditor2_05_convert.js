// 旧エネミーエディタからのデータコンバート
const from_old_editor = Vue.createApp({
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
                let new_data = oldConvertToNew(data);
                // データの読み込みを行わせる
                eet.data_load(new_data);
                eta.data_load(new_data);
                eda.data_load(new_data);
                edr.data_load(new_data);
                // データの読み込みが終了したら、ファイルの破棄を試みる
                document.form_old_data_load.reset();
                // データの読み込みを行った場合、チャットパレットとココフォリア駒データをリセット
                eec.result = "";
                ecca.output = "";
                // alertで返却
                alert("処理が完走しました。データを確認してください。");
            };
            reader.onerror = () => {
                this.message = "ファイルが正しく読み込まれませんでした。";
                return;
            };
        }
    }
});
const efoe = from_old_editor.mount("#tab_old_converter");

function oldConvertToNew(old) {
    let new_data = {
        attestation: "EnemyEditor2-for-BBT",
        data: {
            enemy_base: {
                info: {
                    name: old.baseinfo.name,
                    appearance: old.baseinfo.look,
                    checked_kinds: oldConvertToNew_kinds(old, "種別"),
                    checked_categories: oldConvertToNew_kinds(old, "区分"),
                    note: old.baseinfo.notes
                },
                base_params: oldConvertToNew_BaseParams(old),
                battle_params: oldConvertToNew_BattleParams(old)
            },
            d_arts: [],
            arts: [],
            damagerolls: oldConvertToNew_Damages(old)
        }
    };
    // アーツデータの返却
    [new_data.data.arts, new_data.data.d_arts] = oldConvertToNew_Arts(old);

    // データの返却
    console.log(new_data);
    return JSON.parse(JSON.stringify(new_data));
}

function oldConvertToNew_kinds(old, type) {
    let result = [];
    let temp = [];
    switch(type) {
        case "種別":
            temp = ["人間", "吸血", "来訪", "精霊", "神聖", "魔界", "亜人", "機械", "概念", "邪神", "怪獣", "巨大"];
            break;
        case "区分":
            temp = ["軍団装備", "クラード"];
            break;
    }
    for(let i of old.baseinfo.type.split("／")) {
        if(temp.includes(i)) {
            result.push( i === "軍団装備" ? "軍団武器装備" : i );
        }
    }
    return result;
}

function oldConvertToNew_BaseParams(old) {
    let result = {
        abl: {"肉体":0, "技術":0, "感情":0, "加護":0, "社会":0},
        mod: {"肉体":0, "技術":0, "感情":0, "加護":0, "社会":0},
        amr: {"肉体":0, "技術":0, "感情":0, "加護":0, "社会":0},
        edr: {"肉体":1, "技術":1, "感情":1, "加護":1, "社会":1}
    };
    let n = ["肉体", "技術", "感情", "加護", "社会"];
    let k = ["body", "skill", "emotion", "divine", "society"];
    for(let i = 0; i < 5; i++) {
        // 能力値の基本値
        if(old.baseAbility[k[i]].total) {
            result.abl[n[i]] = parseInt(old.baseAbility[k[i]].total);
        }
        // 判定の修正値
        if(old.baseAbility[k[i]].mod) {
            result.mod[n[i]] = parseInt(old.baseAbility[k[i]].mod);
        }
        // アーマー値修正
        if(old.baseAbility[k[i]].armor.mod) {
            result.amr[n[i]] = parseInt(old.baseAbility[k[i]].armor.mod);
        }
    }
    return result;
}

function oldConvertToNew_BattleParams(old) {
    let result = {
        abl: {"白兵":0, "射撃":0, "回避":0, "行動":0},
        mod: {"白兵":0, "射撃":0, "回避":0, "行動":0},
        otr: {"ＦＰ":0, "アーマー":0, "ガード":0, "レベル":0}
    };
    let n = ["白兵", "射撃", "回避", "行動"];
    let k = ["combat", "shoot", "dodge", "action"];
    for(let i = 0; i < 4; i++) {
        // 能力値の基本値
        if(old.battleAbility[k[i]].total) {
            result.abl[n[i]] = parseInt(old.battleAbility[k[i]].total);
        }
        // 判定の修正値
        if(old.battleAbility[k[i]].mod) {
            result.mod[n[i]] = parseInt(old.battleAbility[k[i]].mod);
        }
    }
    // FP
    if(old.baseinfo.fp) {
        result.otr["ＦＰ"] = parseInt(old.baseinfo.fp);
    }
    // アーマー値
    if(old.baseinfo.armor) {
        result.otr["アーマー"] = parseInt(old.baseinfo.armor);
    }
    // ガード値
    if(old.baseinfo.guard) {
        result.otr["ガード"] = parseInt(old.baseinfo.guard);
    }
    // エネミーレベル
    if(old.baseinfo.enemylv) {
        result.otr["レベル"] = parseInt(old.baseinfo.enemylv);
    }
    return result;
}

function oldConvertToNew_Arts(old) {
    let result_normal = [];
    let result_d_arts = [];
    let elm = {name: "", kind: "", level: "", timing: "", judge: "", tgt: "", range: "", note: "", disptype: "表示"};

    for(let a of old.arts) {
        // アーツデータがない場合はスキップ
        if(!a) { continue; }
        // コピーデータの素体を作成
        let e = JSON.parse(JSON.stringify(elm));
        // 各データのコンバート
        if(a.name) { e.name = a.name; }                 // 名称
        if(a.type) { e.kind = a.type; }                 // 種別
        if(a.level) { e.level = parseInt(a.level); }    // レベル（数値データに変換）
        if(a.timing) { e.timing = a.timing; }           // タイミング
        if(a.judge) { e.judge = a.judge; }              // 判定値
        if(a.target) { e.tgt = a.target; }              // 対象
        if(a.range) { e.range = a.range; }              // 射程
        if(a.notes) { e.note = a.notes; }               // 効果
        // レベル・アイテム表示形式のコンバート
        if(a.treatItem) {
            e.disptype = "アイテム";
        } else {
            e.disptype = a.dispLv ? "表示" : "省略";
        }
        // ドミニオンアーツ辞書に名前がある場合はドミニオンアーツのリストに格納、
        // そうでない場合は通常アーツのリストに格納
        if(DOMINION_ARTS_DICT[a.name]) {
            // 最大LVが1より大きいドミニオンアーツは表示形式を「隠蔽」に変更
            if(DOMINION_ARTS_DICT[a.name].level > 1) { e.disptype = "隠蔽"; }
            result_d_arts.push(e);
        } else {
            result_normal.push(e);
        }
    }

    return [result_normal, result_d_arts];
}

function oldConvertToNew_Damages(old) {
    let result = [];
    let elm = {name: "", kind: "", hit: "", attribute: "なし", damage: "", tgt: "", range: "", note: "", disp: false};

    for (let a of old.arms) {
        // データがない場合はスキップ
        if(!a) { continue; }
        // コピーデータの素体を作成
        let e = JSON.parse(JSON.stringify(elm));
        // 各データのコンバート
        if(a.name) { e.name = a.name; }
        if(a.type) { e.kind = a.type; }
        if(a.judge) { e.hit = a.judge; }
        if(a.element) {
            switch(a.element) {
                case "〈肉体〉":
                    e.attribute = "肉体";
                    break;
                case "〈技術〉":
                    e.attribute = "技術";
                    break;
                case "〈感情〉":
                    e.attribute = "感情";
                    break;
                case "〈加護〉":
                    e.attribute = "加護";
                    break;
                case "〈社会〉":
                    e.attribute = "社会";
                    break;
                default:
                    e.attribute = "なし";
            }
        }
        if(a.damage) { e.damage = a.damage; }
        if(a.target) { e.tgt = a.target; }
        if(a.range) { e.range = a.range; }
        if(a.notes) { e.note = a.notes; }
        if(a.dispMA) { e.disp = true; }
        // データの格納
        result.push(e);
    }
    return result;
}