// チャットパレットに能力値を予約語として書くオンセツール
const RESERVE_ON_PALETTE = ["Quoridorn", "Tekey"];
// 能力語の機能がないオンセツール
const RESERVE_NOT_EXIST = ["なし", "TRPGスタジオ"];

const ee_chatpalette = Vue.createApp({
    data () {
        return {
            system: "なし",
            outputs: ["base_info", "general_action", "arts", "damage"],
            output_base_info:["種別", "ドミニオンアーツ数"],
            output_general_action: ["通常移動", "離脱移動", "ドッジ", "ガード", "リアクション不可", "アクションなし"],
            output_arts: ["タイミング空欄", "タイミング常時", "効果", "対象射程"],
            output_damage: ["効果", "計算"],
            result: "",
        };
    },
    methods: {
        generate_palette() {
            this.result = generate_chat_palette();
        },
        condition_all() {
            let obj = {
                system: this.system,
                base_info: this.output_base_info,
                general_action: this.output_general_action,
                arts: this.output_arts,
                damage: this.output_damage
            };
            return JSON.parse(JSON.stringify(obj));
        },
        output_palette() {
            return JSON.parse(JSON.stringify(this.result));
        }
    },
    computed: {
        check_result() {
            return this.result ? true : false;
        },
        check_base_info() {
            return this.outputs.includes("base_info");
        },
        check_general_action() {
            return this.outputs.includes("general_action");
        },
        check_arts() {
            return this.outputs.includes("arts");
        },
        check_damage() {
            return this.outputs.includes("damage");
        }
    }
});
const eec = ee_chatpalette.mount("#ee_chatpalette");

function generate_chat_palette() {
    let result = [];
    // 情報の取得
    let data = eds.output_data();
    console.log("EnemyData:", data);
    // 出力設定の取得
    let condition = JSON.parse(JSON.stringify(eec.outputs));
    let condition_all = eec.condition_all();
    // エネミー基本情報の出力
    if(condition.includes("base_info")) {
        let result_base = process_enemy_base_info(data);
        if(result_base) { result.push(result_base); }
    }
    // 判定式
    let result_judge = process_enemy_judge(data);
    if(result_judge) { result.push(result_judge); }
    // 一般的な行動宣言
    if(condition.includes("general_action")) {
        let result_general = process_enemy_general_action(data);
        if(result_general) { result.push(result_general); }
    }
    // アーツ
    if(condition.includes("arts")) {
        let result_arts = process_enemy_arts(data);
        if(result_arts) { result.push(result_arts); }
    }
    // ダメージロール関連
    if(condition.includes("damage")) {
        let result_damage = process_enemy_damage(data);
        if(result_damage) { result.push(result_damage); }
    }
    // 能力値関連の処理
    if(RESERVE_ON_PALETTE.includes(condition_all.system)) {
        let result_reserved = process_enemy_reserved(data);
        if(result_reserved) { result.push(result_reserved); }
    }
    let processed = result.join("\n\n");
    // 予約語が使えないツールの対応
    if(RESERVE_NOT_EXIST.includes(condition_all.system)) {
        for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
            processed = str_changefromReserve(processed, i, data.enemy_base.base_params.abl[i]);
        }
        for(let i of ["白兵", "射撃", "回避", "行動"]) {
            processed = str_changefromReserve(processed, i, data.enemy_base.battle_params.abl[i]);
        }
        if(condition_all.damage.includes("計算")) {
            let base_armor = data.enemy_base.battle_params.otr["アーマー"];
            let n = data.enemy_base.base_params;
            for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
                let armor = (base_armor + Math.floor(n.abl[i] / 2) + n.amr[i]) * n.edr[i];
                processed = str_changefromReserve(processed, `${i}アーマー値`, armor);
            }
        }
    }
    return processed;
}

// エネミー基本情報の出力：実際の処理
function process_enemy_base_info(data) {
    let result = [];
    // 出力情報の取得
    let condition = JSON.parse(JSON.stringify(eec.output_base_info));
    // ヘッダ作成
    result.push("■ 基本情報 ----------");
    // 外見的特徴
    if(condition.includes("外見的特徴")) {
        let n = data.enemy_base.info.appearance;
        result.push("外見的特徴：" + n);
    }
    // 種別
    if(condition.includes("種別")) {
        let n = data.enemy_base.info.checked_kinds;
        let m = data.enemy_base.info.checked_categories;
        let a = [];
        if(n) { a.push("種別：" + n.join("、")); }
        if(m) { a.push("区分：" + m.join("、"));}
        result.push(a.join("／"));
    }
    // 基本能力値
    if(condition.includes("基本能力値")) {
        let n = data.enemy_base.base_params.abl;
        let a = [
            "基本能力値",
            `【肉体】${n["肉体"]}`,
            `【技術】${n["技術"]}`,
            `【感情】${n["感情"]}`,
            `【加護】${n["加護"]}`,
            `【社会】${n["社会"]}`
        ];
        result.push(a.join(" "));
    }
    // 戦闘能力値
    if(condition.includes("戦闘能力値")) {
        let n = data.enemy_base.battle_params.abl;
        let a = [
            "戦闘能力値",
            `【白兵】${n["白兵"]}`,
            `【射撃】${n["射撃"]}`,
            `【回避】${n["回避"]}`,
            `【行動】${n["行動"]}`
        ];
        result.push(a.join(" "));
    }
    // アーマー値
    if(condition.includes("アーマー値")) {
        let n = data.enemy_base.base_params;
        let base_armor = data.enemy_base.battle_params.otr["アーマー"];
        let a = ["アーマー値"];
        for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
            let s = `〈${i}〉`;
            let armor = (base_armor + Math.floor(n.abl[i] / 2) + n.amr[i]) * n.edr[i];
            a.push(s + armor);
        }
        result.push(a.join(" "));
    }
    // ガード値、FP最大値、エネミーレベル
    let sub = [];
    if(condition.includes("ガード値")) {
        sub.push(`ガード値：${data.enemy_base.battle_params.otr["ガード"]}`);
    }
    if(condition.includes("FP最大値")) {
        sub.push(`FP最大値：${data.enemy_base.battle_params.otr["ＦＰ"]}`);
    }
    if(condition.includes("エネミーレベル")) {
        sub.push(`レベル：${data.enemy_base.battle_params.otr["レベル"]}`);
    }
    if(sub.length > 0) { result.push(sub.join("／")); }
    // ドミニオンアーツの数
    if(condition.includes("ドミニオンアーツ数")) {
        let n = eda.darts_levels();
        if(n > 0) { result.push(`ドミニオンアーツ合計LV：${n}`); }
    }
    return result.join("\n");
}

// 基本的な判定文
function process_enemy_judge(data) {
    let result = [];
    result.push("■ 基本判定 ----------");
    // 基本能力値
    let m = data.enemy_base.base_params.mod;
    for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
        let a = prefix(eec.system) + `2BB+{${i}}`;
        if(m[i] > 0) {
            a += `+${m[i]}`;
        } else if(m[i] < 0) {
            a += `${m[i]}`;
        }
        a += ` 【${i}】判定`;
        result.push(a);
    }
    // 戦闘能力値
    let n = data.enemy_base.battle_params.mod;
    for(let i of ["白兵", "射撃", "回避", "行動"]) {
        let a = prefix(eec.system) + `2BB+{${i}}`;
        if(n[i] > 0) {
            a += `+${n[i]}`;
        } else if(n[i] < 0) {
            a += `${n[i]}`;
        }
        a += ` 【${i}】判定`;
        result.push(a);
    }
    // アーツデータの判定値から式を作成
    let list_arts = convert_ScoreToJudge(data.arts, "judge");
    if(list_arts.length > 0) { result.push(list_arts.join("\n")); }
    // ドミニオンアーツデータの判定値から式を作成
    let list_drts = convert_ScoreToJudge(data.d_arts, "judge");
    if(list_drts.length > 0) { result.push(list_drts.join("\n")); }
    // ダメージロールデータの命中から式を作成
    let list_dmgs = convert_ScoreToJudge(data.damagerolls, "hit");
    if(list_dmgs.length > 0) { result.push(list_dmgs.join("\n")); }
    // データの出力
    return result.join("\n");
}

// ジェネラルアクション
function process_enemy_general_action(data) {
    let result = [];
    result.push("■ 基本的な行動宣言 ----------");
    // 条件の取得
    let condition = JSON.parse(JSON.stringify(eec.output_general_action));
    // 各種条件に合致する文字列を作成
    if(condition.includes("通常移動")) {
        result.push("ムーブ - 通常移動");
    }
    if(condition.includes("離脱移動")) {
        result.push("メジャー - 離脱移動");
    }
    if(condition.includes("ドッジ")) {
        result.push("リアクション - ドッジ");
    }
    if(condition.includes("ガード")) {
        let g = data.enemy_base.battle_params.otr["ガード"];
        result.push(`リアクション - ガード（ガード値：${g}）`);
    }
    if(condition.includes("リアクション不可")) {
        result.push("リアクション - 不可/放棄");
    }
    if(condition.includes("アクションなし")) {
        result.push("アクションなし");
    }
    // エネミーの通常攻撃相当の行動を拾う
    for(let action of data.damagerolls) {
       if(!action.name) { continue; }
       if(action.disp) {
           let str = `メジャー - 「${action.name}」で攻撃`;
           str += target_and_range(action.tgt, action.range, JSON.parse(JSON.stringify(eec.output_arts)));
           result.push(str);
       }
    }
    return result.join("\n");
}

// アーツ一覧
function process_enemy_arts(data) {
    let result = [];
    result.push("■ アーツ一覧 ----------");
    // LV表示「隠蔽」のリストも並行して作る
    let level_masks = [];
    // 条件の取得
    let condition = JSON.parse(JSON.stringify(eec.output_arts));
    // アーツ配列の取得
    let obj = [].concat(data.d_arts, data.arts);
    // output_arts = ["タイミング空欄", "タイミング常時", "効果"]
    for(let art of obj) {
        // スキップ条件もろもろ
        if(!art) { continue; }                      // アーツデータが無
        if(!art.name) { continue; }                 // アーツの名称がない
        if(art.disptype === "消去") { continue; }   // 表示タイプ「消去」
        if(!condition.includes("タイミング空欄") && !art.timing) { continue; }
        if(!condition.includes("タイミング常時") && art.timing === "常時") { continue; }
        let str = "";
        if(art.timing) { str += `${art.timing} - `; }
        if(art.disptype === "アイテム") {
            str += `「${art.name}」`;
        } else {
            str += `《${art.name}》`;
        }
        switch(art.disptype) {
            case "表示":
                if(art.level) {
                    str += `LV${art.level}`;
                }
                break;
            case "隠蔽":
                if(art.level) {
                    str += "LV.??";
                    level_masks.push(`《${art.name}》LV${art.level}`);
                }
                break;
        }
        str += target_and_range(art.tgt, art.range, condition);
        if(condition.includes("効果") && art.note) {
            str += "：" + str_delete_fl(art.note);
        }
        result.push(str);
    }
    if(level_masks.length > 0) {
        result.push("", "■ LV隠蔽アーツ一覧 ----------");
        result.push(level_masks.join("、"));
    }
    return result.join("\n");
}

// ダメージ一覧
function process_enemy_damage(data) {
    let result = [];
    result.push("■ ダメージロール一覧 ----------");
    let condition = JSON.parse(JSON.stringify(eec.output_damage));
    let obj = data.damagerolls;
    for(let act of obj) {
        // 諸々のスキップ要件
        if(!act) { continue; }
        if(!act.name) { continue; }
        if(!act.damage) { continue; }
        let str = `${act.damage} 「${act.name}」ダメージ`;
        if(act.attribute !== "なし") {
            str += `／〈${act.attribute}〉属性`;
        }
        if(condition.includes("効果") && act.note) {
            str += "／" + str_delete_fl(act.note);
        }
        result.push(str);
    }
    if(!condition.includes("計算")) { return result.join("\n"); }
    // アーマー値計算のお時間
    result.push("", "■ 被ダメージ時のアーマー値計算 ----------");
    for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
        result.push(prefix(eec.system) + `c(ダメージ-{${i}アーマー値}) 被ダメージ計算：〈${i}〉属性`);
    }
    return result.join("\n");
}

// Quoridorn, Tekey用：予約語をチャットパレット末尾に組み込む
function process_enemy_reserved(data) {
    let result = [];
    let condition_all = eec.condition_all();
    result.push("■ 能力値予約語 ----------");
    let a = data.enemy_base.base_params;
    for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
        let str = `//${i}=${a.abl[i]}`;
        result.push(str);
    }
    let b = data.enemy_base.battle_params;
    for(let i of ["白兵", "射撃", "回避", "行動"]) {
        let str = `//${i}=${b.abl[i]}`;
        result.push(str);
    }
    if(condition_all.damage.includes("計算")) {
        // アーマー値計算
        for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
            let i_armor = (b.otr["アーマー"] + Math.floor(a.abl[i] / 2) + a.amr[i]) * a.edr[i];
            let str = `//${i}アーマー値=${i_armor}`;
            result.push(str);
        }
    }
    return result.join("\n");
}

// 対象文字列の作成
function target_and_range(tgt, rng, condition) {
    let result = [];
    let a = condition.includes("自身省略");
    let b = condition.includes("対象簡易");
    let c = condition.includes("対象射程");
    if(!c) { return ""; }
    if(tgt) {
        if(tgt === "自身" && a) { return ""; }
        result.push((b ? "" : "対象：") + `${tgt}`);
    }
    if(tgt !== "自身") {
        if(rng) {
            result.push((b ? "" : "射程：") + `${rng}`);
        }
    }
    return result.length > 0 ? `〔${result.join("／")}〕` : "";
}

// 接頭辞の取得（TRPGスタジオのみ）
function prefix(system) {
    return system === "TRPGスタジオ" ? "/ " : "";
}

// 改行文字の削除
function str_delete_fl(string) {
    if(!string) { return ""; }
    return string.replace(/\r?\n/g, "");
}

// 全角文字を半角文字に
function str_changeEmToEn(string) {
    if(!string) { return ""; }
    return string.replace(/[Ａ-Ｚａ-ｚ０-９＋－（）]/g, function(s) { return String.fromCharCode(s.charCodeAt(0)- 0xFEE0);});
}

// 「判定値」欄の【能力値】記入を判定用の文字列に変換
function str_ScoreToText(string) {
    if(!string) { return ""; }
    return string.replace(/[\[\]\{\}【】［］値]/g, "").replace(/(肉体|技術|感情|加護|社会|白兵|射撃|回避|行動)/g, "{$&}");
}

// 能力値の予約語参照を平書きに書き換える
function str_changefromReserve(string, name, abl) {
    if(!string || !name || abl === void(0) ) { return ""; }
    return string.replaceAll(`{${name}}`, `${abl}`);
}

// アーツ、アイテムの「判定値」欄から判定用の文字列を作成
// argName: 判定値に相当するデータの保存名。アーツデータなら"judge", ダメージロールデータなら"hit"
function convert_ScoreToJudge(data, argName) {
    if(!data){ return []; }
    if(!argName) { return []; }
    let result = [];
    for(let i of data) {
        // データが無、名称未設定、判定値データがないもの、「自動成功」はスキップ
        if(!i || !i.name || !i[argName] || i[argName] === "自動成功" ) { continue; }
        // ダメージロールデータで、「表示」にチェックがない項目はスキップ
        if(argName === "hit" && !i.disp) { continue; }
        // データの作成開始
        let s = "";
        let str = str_ScoreToText(i[argName]);
        // 数字か{能力値}で始まる場合、そのまま2BB+～ で作成
        if(str.match(/^[\d\{]/)) {
            s = "2BB+" + str;
            // アーツデータかダメージロールデータか、どちらから入力されたかによって括弧が変化
            switch(argName) {
                case "judge":
                    s += ` 《${i.name}》判定`;
                    break;
                case "hit":
                    s += ` 「${i.name}」命中判定`;
                    break;
            }
            result.push(s);
        }
        // ダメージロールの「命中」欄、かつ「+」か「-」で始まる場合、白兵か射撃かを確認して文字列を作成
        if(argName === "hit" && str.match(/^[-\+]/)) {
            // 種別欄が空欄の場合はスキップ
            if(!i.kind) { continue; }
            // 種別欄に「白兵」を含む場合、【白兵値】を参照する式を作成
            if(i.kind.match(/白兵/)) {
                s = "2BB+{白兵}" + str + ` 「${i.name}」命中判定`;
                result.push(s);
            }
            // 種別欄に「射撃」を含む場合、【射撃値】を参照する式を作成
            if(i.kind.match(/射撃/)) {
                s = "2BB+{射撃}" + str + ` 「${i.name}」命中判定`;
                result.push(s);
            }
        }
    }
    console.log(result);
    return result;
}