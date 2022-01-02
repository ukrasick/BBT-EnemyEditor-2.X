const ccfolia_clipboard_api = Vue.createApp({
    data() {
        return {
            pone_size: 2,
            color: "rgb(158, 158, 158)",
            active: true,
            secret: false,
            invisible: false,
            hideStatus: false,
            other_status: [],
            memo: "",
            palette_output: true,
            select_quick: "空行",
            output: "",
            color_picker: "free",
            color_preset: ["#222222", "#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#607D8B", "#9E9E9E", "#E0E0E0"]
        };
    },
    methods: {
        status_data_template() {
            return { label: "", value: 0, max:0 };
        },
        status_new_line() {
            let data = this.status_data_template();
            let pone_data = eds.output_data();
            switch(this.select_quick) {
                case "FP自動":
                    data.label = "FP";
                    data.value = pone_data.enemy_base.battle_params.otr["ＦＰ"];
                    data.max = pone_data.enemy_base.battle_params.otr["ＦＰ"];
                    break;
                case "FPゼロ":
                    data.label = "FP";
                    break;
                case "財産点":
                    data.label = "財産点";
                    data.value = pone_data.enemy_base.base_params.abl["社会"];
                    data.max = pone_data.enemy_base.base_params.abl["社会"];
            }
            this.other_status.push(data);
        },
        status_delete(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = k.parentNode.getElementsByTagName("tr");
                table = [].slice.call(table);
                let i = table.indexOf(k);
                this.other_status.splice(i-1, 1);
            }
        },
        status_upward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = k.parentNode.getElementsByTagName("tr");
                table = [].slice.call(table);
                let i = table.indexOf(k);
                if(i == 1) { return; }
                let c = this.other_status[i-1];
                this.other_status.splice(i-1, 1);
                this.other_status.splice(i-2, 0, c);
            }
        },
        status_downward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = k.parentNode.getElementsByTagName("tr");
                table = [].slice.call(table);
                let i = table.indexOf(k);
                if(i == table.length - 1) { return; }
                let c = this.other_status[i-1];
                this.other_status.splice(i-1, 1);
                this.other_status.splice(i, 0, c);
            }
        },
        color_pick_button(event) {
            if(event) {
                this.color = event.target.style['background-color'];
            }
        },
        quote_base_info(kind) {
            switch(kind) {
                case "名称":
                    this.memo += "名前：" + JSON.parse(JSON.stringify(eet.base_info.name)) + "\n";
                    break;
                case "外見":
                    this.memo += "外見：" + JSON.parse(JSON.stringify(eet.base_info.appearance)) + "\n";
                    break;
                case "種別":
                    this.memo += "種別：" + JSON.parse(JSON.stringify(eet.base_info.checked_kinds)).join("、") + "\n";
                    break;
                case "区分":
                    this.memo += "区分：" + JSON.parse(JSON.stringify(eet.base_info.checked_categories)).join("、") + "\n";
                    break;
                case "備考":
                    this.memo += "備考：" + JSON.parse(JSON.stringify(eet.base_info.note)) + "\n";
                    break;
            }
        },
        output_clip() {
            this.output = generate_clipboard_data();
        }
    },
    computed: {
        palette_generated() {
            let p = eec.output_palette();
            return p ? true : false;
        },
        output_generated() {
            let p = this.output;
            return p ? true : false;
        }
    }
});
const ecca = ccfolia_clipboard_api.mount("#ee_ccfolia_api");

function generate_clipboard_data() {
    // キャラクターデータの取得
    let data = eds.output_data();
    // データテンプレートを作成
    let clip = {
        kind: "character",
        data: {
            name: data.enemy_base.info.name,
            memo: ecca.memo,
            initiative: data.enemy_base.battle_params.abl["行動"],
            externalUrl: "",
            status: generate_ccfolia_clip_status(),
            params: generate_ccfolia_clip_params(data),
            width: ecca.pone_size,
            height: ecca.pone_size,
            active: ecca.active,
            secret: ecca.secret,
            invisible: ecca.invisible,
            hideStatus: ecca.hideStatus,
            color: ecca.color,
            commands: ecca.palette_output ? eec.result : ""
        }
    };
    // ステータスの設定
    // パラメータの設定
    // チャットパレットの設定
    return JSON.stringify(clip);
}

function generate_ccfolia_clip_status() {
    let items = JSON.parse(JSON.stringify(ecca.other_status));
    let done = [];
    let result = [];
    for(let i of items) {
        if(done.includes(i.label)) { continue; }
        result.push(i);
        done.push(i.label);
    }
    return result;
}

function generate_ccfolia_clip_params(data) {
    let result = [];
    for(let k of ["肉体", "技術", "感情", "加護", "社会"]) {
        result.push({label: k, value: `${data.enemy_base.base_params.abl[k]}`});
    }
    for(let k of ["白兵", "射撃", "回避", "行動"]) {
        result.push({label: k, value: `${data.enemy_base.battle_params.abl[k]}`});
    }
    // let conditions = eec.condition_all();
    // アーマー値をチャットパレットに入れる場合、各アーマー値もパラメータに入れる
    if(eec.condition_all().damage.includes("計算") && ecca.palette_output) {
        let base_armor = data.enemy_base.battle_params.otr["アーマー"];
        let n = data.enemy_base.base_params;
        for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
            let armor = (base_armor + Math.floor(n.abl[i] / 2) + n.amr[i]) * n.edr[i];
            result.push({label: `${i}アーマー値`, value: `${armor}`});
        }
    }
    return result;
}

new ClipboardJS(".clipboard_button");