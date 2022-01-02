const DOMINION_ARTS_LIST = {
    "基本ルールブック": {
        "特技級": ["世界律：神速", "世界律：崩壊", "世界律：不変", "世界律：超越", "世界律：召喚", "世界律：排斥", "世界律：絶望", "世界律：不滅"],
        "災厄級": ["資産：願望", "資産：帰還門", "資産：支配", "資産：封印", "資産：空間展開", "資産：転生", "資産：破壊", "資産：法則"]
    },
    "ディケイド": {
        "特技級": ["世界律：恩恵", "世界律：禁則", "世界律：君臨", "世界律：混沌", "世界律：散華", "世界律：否定", "世界律：抹消", "世界律：無限"],
        "災厄級": ["資産：隠匿", "資産：黄金", "資産：告死", "資産：停滞", "資産：迫害", "資産：復活", "資産：閉鎖", "資産：忘却"]
    },
    "ドミニオンズ": {
        "Dエゴ": ["王の前なり、頭を垂れよ", "王の眼は全てを映す", "王命なり、時よ止まれ", "己が獣を解き放つがよい", "愚かなる者、神罰を受けよ", "これこそが絶対の力なり", "神威の前に消滅せよ", "その非礼、死をもって詫びよ", "其は許されざる存在なり", "天地万物みな我が駒なり", "我が威光をその身に浴せ", "我が王国を受け継ぐがよい", "我が支配は永遠不滅なり", "我が存在は無窮にして無謬", "我が力は尽きることなし", "我は喚起す、大いなる奈落", "我はただひとりに非ず"]
    },
    "アドヴェント": {
        "特技級": ["世界律：汚染", "世界律：幻像", "世界律：号令", "世界律：転移", "世界律：反射", "世界律：不壊", "世界律：暴発", "世界律：魔群"],
        "災厄級": ["資産：感情操作", "資産：空間連結", "資産：生命共有", "資産：造物主", "資産：堕落", "資産：同化吸収", "資産：縛鎖", "資産：暴露"],
        "Dエゴ": ["これぞ我が神体なり", "その身を灼き滅ぼされよ", "汝、命尽きる時にあらず", "我が王国がそなたを護る", "我が前に全ては無為", "我こそは破壊の化身なり", "我を傷つけること能わず", "我が命すなわち世界なり"]
    },
    "ピックアップ": {
        "汎用": ["世界律：神速", "世界律：崩壊", "世界律：不変", "世界律：超越", "世界律：絶望", "世界律：不滅", "資産：帰還門", "資産：空間展開"]
    }
};

const DOMINION_ARTS_DICT = {
    "世界律：神速": {
        timing: "イニシアチブ", kind:"", level: 5, tgt: "自身", range: "なし"
    },
    "世界律：崩壊": {
        timing: "効果参照", kind:"", level: 5, tgt: "自身", range: "なし"
    },
    "世界律：不変": {
        timing: "効果参照", kind:"", level: 1, tgt: "自身", range: "なし"
    },
    "世界律：超越": {
        timing: "判定の直後", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "世界律：召喚": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "世界律：排斥": {
        timing: "常時", kind:"", level: 5, tgt: "自身", range: "なし"
    },
    "世界律：絶望": {
        timing: "DRの直前", kind:"", level: 5, tgt: "自身", range: "なし"
    },
    "世界律：不滅": {
        timing: "常時", kind:"", level: 1, tgt: "自身", range: "なし"
    },
    "世界律：恩恵": {
        timing:"常時", kind:"", level: 1, tgt: "自身", range: "なし"
    },
    "世界律：禁則": {
        timing: "セットアップ", kind:"", level: 5, tgt: "シーン", range: "シーン"
    },
    "世界律：君臨": {
        timing: "常時", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "世界律：混沌": {
        timing: "セットアップ", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "世界律：散華": {
        timing: "効果参照", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "世界律：否定": {
        timing: "効果参照", kind:"", level: 10, tgt: "単体", range: "シーン"
    },
    "世界律：抹消": {
        timing: "メジャー", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "世界律：無限": {
        timing: "効果参照", kind:"", level: 10, tgt: "自身", range: "シーン"
    },
    "世界律：汚染": {
        timing: "セットアップ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "世界律：幻像": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "自身", range: "シーン"
    },
    "世界律：号令": {
        timing: "セットアップ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "世界律：転移": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "範囲", range: "シーン"
    },
    "世界律：反射": {
        timing: "効果参照", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "世界律：不壊": {
        timing: "常時", kind:"", level: 1, tgt: "自身", range: "なし"
    },
    "世界律：暴発": {
        timing: "効果参照", kind:"", level: 10, tgt: "単体", range: "シーン"
    },
    "世界律：魔群": {
        timing: "セットアップ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "王の前なり、頭を垂れよ": {
        timing: "常時", kind: "Dエゴ", level: 1, tgt: "自身", range: "なし"
    },
    "王の眼は全てを映す": {
        timing: "常時", kind: "Dエゴ", level: 1, tgt: "自身", range: "シーン"
    },
    "王命なり、時よ止まれ": {
        timing: "イニシアチブ", kind: "Dエゴ", level: 3, tgt: "自身", range: "シーン"
    },
    "己が獣を解き放つがよい": {
        timing: "常時", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "愚かなる者、神罰を受けよ": {
        timing: "メジャー", kind: "Dエゴ", level: 3, tgt: "範囲", range: "シーン"
    },
    "これこそが絶対の力なり": {
        timing: "判定の直後", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "神威の前に消滅せよ": {
        timing: "DRの直前", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "その非礼、死をもって詫びよ": {
        timing: "判定の直後", kind: "Dエゴ", level: 3, tgt: "単体", range: "シーン"
    },
    "其は許されざる存在なり": {
        timing: "常時", kind: "Dエゴ", level: 1, tgt: "自身", range: "なし"
    },
    "天地万物みな我が駒なり": {
        timing: "イニシアチブ", kind: "Dエゴ", level: 3, tgt: "範囲", range: "シーン"
    },
    "我が威光をその身に浴せ": {
        timing: "常時", kind: "Dエゴ", level: 1, tgt: "自身", range: "なし"
    },
    "我が王国を受け継ぐがよい": {
        timing: "メジャー", kind: "Dエゴ", level: 1, tgt: "単体", range: "至近"
    },
    "我が支配は永遠不滅なり": {
        timing: "効果参照", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "我が存在は無窮にして無謬": {
        timing: "効果参照", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "我が力は尽きることなし": {
        timing: "効果参照", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "我は喚起す、大いなる奈落": {
        timing: "常時", kind: "Dエゴ", level: 1, tgt: "自身", range: "なし"
    },
    "我はただひとりに非ず": {
        timing: "セットアップ", kind: "Dエゴ", level: 3, tgt: "自身", range: "なし"
    },
    "これぞ我が神体なり": {
        timing: "セットアップ", kind: "Dエゴ", level: 5, tgt: "自身", range: "なし"
    },
    "その身を灼き滅ぼされよ": {
        timing: "常時", kind: "Dエゴ", level: 5, tgt: "自身", range: "なし"
    },
    "汝、命尽きる時にあらず": {
        timing: "効果参照", kind: "Dエゴ", level: 3, tgt: "単体", range: "シーン"
    },
    "我が王国がそなたを護る": {
        timing: "メジャー", kind: "Dエゴ", level: 3, tgt: "シーン", range: "シーン"
    },
    "我が前に全ては無為": {
        timing: "判定の直後", kind: "Dエゴ", level: 3, tgt: "単体", range: "シーン"
    },
    "我こそは破壊の化身なり": {
        timing: "常時", kind: "Dエゴ", level: 1, tgt: "自身", range: "なし"
    },
    "我を傷つけること能わず": {
        timing: "常時", kind: "Dエゴ", level: 5, tgt: "自身", range: "なし"
    },
    "我が命すなわち世界なり": {
        timing: "クリンナップ", kind: "Dエゴ", level: 5, tgt: "自身", range: "なし"
    },
    "資産：願望": {
        timing: "メジャー", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "資産：帰還門": {
        timing: "メジャー", kind:"", level: 10, tgt: "範囲", range: "シーン"
    },
    "資産：支配": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：封印": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：空間展開": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "効果参照", range: "シーン"
    },
    "資産：転生": {
        timing: "セットアップ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：破壊": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：法則": {
        timing: "セットアップ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：隠匿": {
        timing: "メジャー", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "資産：黄金": {
        timing: "メジャー", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "資産：告死": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：停滞": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：迫害": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：復活": {
        timing: "メジャー", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：閉鎖": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：忘却": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：感情操作": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：空間連結": {
        timing: "メジャー", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "資産：生命共有": {
        timing: "メジャー", kind:"", level: 10, tgt: "シーン", range: "シーン"
    },
    "資産：造物主": {
        timing: "メジャー", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "資産：堕落": {
        timing: "メジャー", kind:"", level: 10, tgt: "自身", range: "なし"
    },
    "資産：同化吸収": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "単体", range: "至近"
    },
    "資産：縛鎖": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "単体", range: "シーン"
    },
    "資産：暴露": {
        timing: "イニシアチブ", kind:"", level: 10, tgt: "自身", range: "なし"
    }
};