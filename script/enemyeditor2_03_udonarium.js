const udonarium_pone_generator = Vue.createApp({
    data () {
        return {
            output_base_info: ["種別", "区分", "備考", "FP表示", "チャットパレット"],
            output_fp: "FP最大",
            pone_size: 1,
            other_status: [],
            image: "",
            message: ""
        };
    },
    methods: {
        status_data_template() {
            return {label: "", value: 0, max: 0};
        },
        delete_line(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                this.other_status.splice(i-1, 1);
            }
        },
        upward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.other_status.splice(i-1, 1);
                this.other_status.splice(i-2, 0, c);
            }
        },
        downward(event) {
            if(event) {
                let k = event.target.parentNode.parentNode;
                let table = [].slice.call(k.parentNode.getElementsByTagName("tr"));
                let i = table.indexOf(k);
                if(i == table.length - 1) { return; }
                let c = JSON.parse(JSON.stringify(this.items[i-1]));
                this.other_status.splice(i-1, 1);
                this.other_status.splice(i, 0, c);
            }
        },
        status_new_line() {
            let data = this.status_data_template();
            this.other_status.push(data);
        },
        load_image(e) {
            this.message = "";
            console.log(e);
            let file = e.target.files[0];
            if(!file) {
                this.message = "ファイルが正常に読み込まれていません";
                return;
            }
            console.log(file.type);
            let allowed_type = ["jpeg", "png", "bmp"];
            let found = false;
            allowed_type.forEach(function(extension) {
                if (file.type.match('image/'+extension)) { found = true; }
            });
            if(!found) {
                this.message = "ファイルタイプが対応していません";
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if(!reader.result) {
                    this.message = "ファイルが正常に読み込まれませんでした";
                    return;
                }
                this.image = reader.result;
                loadingEnemyImage(reader.result);
            };
        },
        revoke_image() {
            revokeEnemyImage();
        },
        generate_data() {
            generate_udonarium_pone();
        },
        output_data() {
            let d = {
                output_base_info: this.output_base_info,
                output_fp: this.output_fp,
                pone_size: this.pone_size,
                other_status: this.other_status,
                image: this.image
            };
            return JSON.parse(JSON.stringify(d));
        }
    },
    computed: {
        palette_generated() {
            let p = eec.output_palette();
            return p ? true : false;
        }
    }
});
const eupg = udonarium_pone_generator.mount("#ee_udonarium_generator");

function tabstr(i) {
    if(typeof i !== "number") { i = 0; }
    return "\t".repeat(Math.max(i, 0));
}

// 半角不等号を文字コードに
function str_changeLtGt(string) {
    if(!string) { return ""; }
    return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 駒画像データの処理
function loadingEnemyImage(b64) {
    if(!b64) { return; }
    // 展開場所の確認
    let area = document.getElementById("ee2_udona_pone_image");
    // 画像データの作成
    let img = new Image();
    img.onload = () => {
        if(area.hasChildNodes()) { area.removeChild(area.firstChild); }
        area.appendChild(img);
        resizeEnemyImage(img, 500);
    };
    img.id = "enemyimage";
    img.src = b64;
}

// 駒画像データの縮小（幅300以下＆高さ300以下）
function resizeEnemyImage(img, lim = 300) {
    console.log(img.width, img.height);
    // 幅300以上
    if(img.width > lim) {
        img.height *= lim / img.width;
        img.width = lim;
        console.log(img.width, img.height);
    }
    if(img.height > lim) {
        img.width *= lim / img.height;
        img.height = lim;
        console.log(img.width, img.height);
    }
}

// 画像データの破棄
function revokeEnemyImage() {
    let area = document.getElementById("ee2_udona_pone_image");
    if(area.hasChildNodes()) { area.removeChild(area.firstChild); }
    eupg.image = "";
}

// 画像のハッシュを作成
function getImageHash(b64) {
    if(!b64) { return "none_icon"; }
    let shaObj = new jsSHA("SHA-256", "B64");
    shaObj.update(b64.replace(/^.*,/ , ""));
    return shaObj.getHash("HEX");
}

// 駒データの作成
function generate_udonarium_pone() {
    // キャラクターデータの取得
    let data = eds.output_data();
    // 出力設定の取得
    let expo = eupg.output_data();
    // 変数設定
    let r = [];

    // 定義開始
    r.push('<character location.name="table" location.x="300" location.y="300" posZ="0" rotate="0" roll="0">');
    // キャラクターデータの全体像
    r.push(tabstr(1) + '<data name="character">');
    // キャラクター画像
    r.push(tabstr(2) + '<data name="image">');
    r.push(tabstr(3) + `<data type="image" name="imageIdentifier">${getImageHash(expo.image)}</data>` );
    r.push(tabstr(2) + '</data>');
    // 基本情報
    r.push(tabstr(2) + '<data name="common">');
    r.push(tabstr(3) + `<data name="name">${data.enemy_base.info.name}</data>`);
    r.push(tabstr(3) + `<data name="size">${expo.pone_size}</data>`);
    r.push(tabstr(2) + "</data>");
    // 基本ステータス
    r.push(tabstr(2) + '<data name="detail">');
    r.push(tabstr(3) + '<data name="基本ステータス">');
    // FP
    if(expo.output_base_info.includes("FP表示")) {
        switch(expo.output_fp) {
            case "FP最大":
                r.push(tabstr(4) + `<data type="numberResource" currentValue="${data.enemy_base.battle_params.otr["ＦＰ"]}" name="FP">${data.enemy_base.battle_params.otr["ＦＰ"]}</data>`);
                break;
            case "FPゼロ":
                r.push(tabstr(4) + `<data name="FP">0</data>`);
                break;
        }
    }
    // 追加ステータス
    if(expo.other_status) {
        for(let i of expo.other_status) {
            if(i.max == 0) {
                r.push(tabstr(4) + `<data name="${i.label}">${i.value}</data>`);
            } else {
                r.push(tabstr(4) + `<data type="numberResource" currentValue="${i.value}" name="${i.label}">${i.max}</data>`);
            }
        }
    }
    // 種別、区分、備考
    if(expo.output_base_info.includes("種別")) {
        r.push(tabstr(4) + `<data type="note" name="種別">${data.enemy_base.info.checked_kinds.join("/")}</data>`);
    }
    if(expo.output_base_info.includes("区分")) {
        r.push(tabstr(4) + `<data type="note" name="区分">${data.enemy_base.info.checked_categories.join("/")}</data>`);
    }
    if(expo.output_base_info.includes("備考")) {
        r.push(tabstr(4) + `<data type="note" name="備考">${data.enemy_base.info.note}</data>`);
    }
    r.push(tabstr(3) + '</data>');
    // 能力値データの作成
    r.push(tabstr(3) + '<data name="能力値">');
    for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
        r.push(tabstr(4) + `<data name="${i}">${data.enemy_base.base_params.abl[i]}</data>`);
    }
    for(let i of ["白兵", "射撃", "回避", "行動"]) {
        r.push(tabstr(4) + `<data name="${i}">${data.enemy_base.battle_params.abl[i]}</data>`);
    }
    for(let i of ["肉体", "技術", "感情", "加護", "社会"]) {
        let n = data.enemy_base.base_params;
        let base_armor = data.enemy_base.battle_params.otr["アーマー"];
        let armor = (base_armor + Math.floor(n.abl[i] / 2) + n.amr[i]) * n.edr[i];
        r.push(tabstr(4) + `<data name="${i}アーマー値">${armor}</data>`);
    }
    r.push(tabstr(3) + "</data>");
    // detailのクローズ
    r.push(tabstr(2) + '</data>');
    // キャラクターデータのクローズ
    r.push(tabstr(1) + '</data>');
    // チャットパレットデータの追加
    if(expo.output_base_info.includes("チャットパレット")) {
        r.push(`<chat-palette dicebot="BeastBindTrinity">${eec.output_palette()}</chat-palette>`);
    }
    // キャラクター情報の定義終了
    r.push('</character>');
    // 保存ファイルの作成
    let xml = new Blob([r.join("\n")], {type: "text/xml"});
    let img = expo.image.replace(/^.*,/ , "");
    let hsh = getImageHash(expo.image);
    // 駒データzipの作成
    let zip = new JSZip();
    zip.file("data.xml", xml);
    if(img && hsh !== "none_icon") {
        zip.file(`${hsh}.png`, img, {base64: true});
    }
    //zipファイルの保存
    zip.generateAsync({type: "blob"}).then(function(content) {
        saveAs(content, `${data.enemy_base.info.name}.zip`);
    });
}

