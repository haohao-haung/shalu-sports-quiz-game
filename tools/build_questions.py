import json
import sys
from pathlib import Path

from extract_quiz_docx import extract_multiple_choice, read_docx_lines


ROOT = Path(r"C:\Users\USER\Desktop\段考複習設計")
OUT = Path("data/questions.js")


LEVELS = [
    {
        "id": "lesson7",
        "title": "第一關",
        "subtitle": "第七課 深藍的憂鬱",
        "description": "挑戰小卷第二頁 10 題，加上正式卷選擇題 1-20 題。",
        "papers": [
            {"label": "第七課 深藍的憂鬱 小卷", "file": "第七課 深藍的憂鬱 小卷.docx", "page": 2, "start": 1, "end": 10},
            {"label": "第七課 深藍的憂鬱", "file": "第七課 深藍的憂鬱.docx", "start": 1, "end": 20, "stop_section": "四、題組"},
        ],
    },
    {
        "id": "lesson8",
        "title": "第二關",
        "subtitle": "第八課 陋室銘",
        "description": "挑戰小卷第二頁 10 題，加上正式卷選擇題 1-20 題。",
        "papers": [
            {"label": "第八課 陋室銘 小卷", "file": "第八課 陋室銘 小卷.docx", "page": 2, "start": 1, "end": 10},
            {"label": "第八課 陋室銘", "file": "第八課 陋室銘.docx", "start": 1, "end": 25, "stop_section": "四、題組"},
        ],
    },
    {
        "id": "lesson9",
        "title": "第三關",
        "subtitle": "第九課 鳥",
        "description": "挑戰小卷第二頁 10 題，加上正式卷選擇題 1-20 題。",
        "papers": [
            {"label": "第九課 鳥 小卷", "file": "第九課 鳥 小卷.docx", "page": 2, "start": 1, "end": 10},
            {"label": "第九課 鳥", "file": "第九課 鳥.docx", "start": 1, "end": 25, "stop_section": "四、題組"},
        ],
    },
    {
        "id": "lesson10",
        "title": "第四關",
        "subtitle": "第十課 秋之味",
        "description": "挑戰小卷第二頁 10 題，加上正式卷選擇題 1-20 題。",
        "papers": [
            {"label": "第十課 秋之味 小卷", "file": "第十課 秋之味 小卷.docx", "page": 2, "start": 1, "end": 10},
            {"label": "第十課 秋之味", "file": "第十課 秋之味.docx", "start": 1, "end": 20, "stop_section": "四、題組"},
        ],
    },
    {
        "id": "self3",
        "title": "第五關",
        "subtitle": "自學選文三 演講",
        "description": "挑戰小卷第二頁 10 題，加上正式卷選擇題 1-20 題。",
        "papers": [
            {"label": "自學選文三 演講 小卷", "file": "自學選文三 演講 小卷.docx", "page": 2, "start": 1, "end": 10},
            {"label": "自學選文三 演講", "file": "自學選文三 演講.docx", "start": 1, "end": 20, "stop_section": "四、題組"},
        ],
    },
    {
        "id": "review",
        "title": "第六關",
        "subtitle": "總複習",
        "description": "挑戰總複習 1 選擇題 1-22 題，以及總複習 2 選擇題 1-24 題。",
        "papers": [
            {"label": "總複習1", "file": "總複習 1.docx", "start": 1, "end": 22},
            {"label": "總複習2", "file": "總複習 2.docx", "start": 1, "end": 24},
        ],
    },
]

EXPLANATION_OVERRIDES = {
    "lesson7-第七課-深藍的憂鬱-17": "文章強調要把屬於自己的歌「彈出來」，意思是展現自我、活出自己獨特的生命色彩，故選(B)。",
    "lesson9-第九課-鳥-小卷-1": "(A)ㄓㄨㄛˊ／ㄔㄨㄢˊ，(B)ㄅㄛˊ／ㄈㄨˊ，(C)皆讀ㄍㄜˊ，(D)ㄌㄧㄠˊ／ㄌㄧㄠˇ，故選(C)。",
    "lesson10-第十課-秋之味-小卷-10": "作者透過文旦、蔬果等食物的滋味與氣味，抒發秋天帶來的美好感受，故選(D)。(A)本文並非以議論為主，(B)未以排比為主要手法，(C)未以對比為主要手法。",
    "lesson10-第十課-秋之味-3": "「熟讀玩味」指仔細閱讀並探索體會其中涵意；「耐人尋味」指意味深遠，讓人反覆尋思體會；「況味」指景況、滋味，故選(B)。",
    "lesson10-第十課-秋之味-10": "由「收穫的季節」可知第一個空格為「秋」；秋天收穫常與「金黃」意象相連；由「熱情」可知第三個空格應為「夏」，故選(C)。",
    "lesson10-第十課-秋之味-14": "「甘蔗無雙頭甜」比喻事情難以兩全其美，並非只是在說人不能太貪心，因此(A)說明錯誤。",
    "self3-自學選文三-演講-3": "(A)準備／盡、皆，完全的意思；(B)皆為緊靠、相鄰；(C)立刻、突然／以頭或腳碰觸地面；(D)存在／交往、對待，故選(B)。",
    "self3-自學選文三-演講-5": "(A)「不言而喻」指不用說明就能明白，用來形容日夜苦練所展現的奪冠企圖心最恰當。(B)「夾槍帶棒」指言語中暗藏諷刺，(C)「三緘其口」形容說話謹慎或不說話，(D)「天花亂墜」多指說話浮誇不切實際，皆不合語境。",
    "self3-自學選文三-演講-9": "(A)「雖然」宜改成「如果」；(C)「難道」宜改成「終於」；(D)「然而」宜改成「反而」。只有(B)用字遣詞最恰當。",
    "review-總複習2-10": "從「這回，深藍簡直不堪一擊，一敗塗地，而且，大聲哭起來……」可知，深藍所指的是自己已具有情感反應，因此選(B)。",
    "review-總複習2-22": "由圖中五首歌所節錄的歌詞，可找出共通性為秋天常引發思念與感傷，因此選(A)。",
    "lesson10-第十課-秋之味-小卷-8": "題幹強調蘿蔔「辛辣中的清甜」與「生吃尤顯滋味」，重點在時蔬本身帶來的味覺享受與生活愉悅，因此選(A)。題目沒有提到鄰居分享、秋日風光或農人勞作。",
    "self3-自學選文三-演講-小卷-6": "題幹指出成功演講不只靠語言內容，還包含語調、語速、肢體語言等表現方式，所以演講要兼顧聲音、動作與表情，故選(B)。",
    "self3-自學選文三-演講-4": "文章提醒科技力量龐大，但也可能帶來安全、隱私與社交等隱憂，主旨是人類應謹慎、明智地發展和使用科技，因此選(A)。",
    "self3-自學選文三-演講-10": "「欲加之罪，何患無辭」意思是想加罪於人，就不愁找不到藉口。選項(D)中上司為辭退員工而硬找罪名，最符合這句諺語的用法。",
    "lesson8-第八課-陋室銘-20": "題幹與(A)都表達即使處於簡陋或淺小的環境，也可能因其中具有不凡價值而不平凡。「淺處無妨有臥龍」呼應「斯是陋室，惟吾德馨」，所以選(A)。",
    "lesson8-第八課-陋室銘-22": "題幹強調物質環境雖然狹小髒亂，但因專注於自我修養而感到舒適，意思最接近「君子居之，何陋之有」，故選(B)。(A)強調天無絕人之路，(C)強調循序漸進，(D)強調登高望遠，都不合題意。",
    "lesson7-第七課-深藍的憂鬱-6": "題幹強調無論站得多高、算得多快，仍有更廣大的空間與時間無法窮盡，意思接近「一山還有一山高」，表示人外有人、天外有天，故選(A)。(B)重在知識不足，(C)重在靜觀體會，(D)重在勤學，皆不合題意。",
    "lesson7-第七課-深藍的憂鬱-15": "「潰不成軍」、「丟盔棄甲」、「土崩瓦解」都可形容戰敗或局勢崩潰的慘敗狀況，所以是甲、丙、戊，故選(C)。「倚馬可待」形容文思敏捷，「叱吒風雲」形容聲勢威猛，「敗興而歸」只是掃興離開，不能表示慘敗。",
    "lesson7-第七課-深藍的憂鬱-19": "文中描述天空有大聲如雷的大星墜落，地面被燒出深洞，最後取得一顆仍發熱、色如鐵的圓石，這些特徵符合隕石墜落，故選(C)。閃電、地震、龍捲風都不會留下這樣的發熱圓石。",
    "lesson7-第七課-深藍的憂鬱-20": "冒險家、發明家、哲學家、科學家的瘋狂追求，重點在他們樂於投入且願意承受辛苦，因此空格最適合填「興趣」，故選(D)。「命運」、「習慣」、「智慧」都無法承接這種主動追求與熱愛。",
    "lesson9-第九課-鳥-11": "正確成語依序是「千里鵝毛」、「鳶飛魚躍」、「鶼鰈情深」、「鷸蚌相爭」、「鳩占鵲巢」、「鴉雀無聲」，所以應填鵝、鳶、鶼、鷸、鳩、鴉，故選(B)。其他選項會造成成語用字錯誤。",
    "lesson9-第九課-鳥-20": "「夫妻本是同林鳥，大難來時各自飛」表示夫妻或伴侶在困難時分離，意義接近「別鶴孤鸞」，指夫妻離散或孤單失偶，故選(D)。(A)指占據他人位置，(B)指驚慌逃竄，(C)指夫妻感情深厚，意思相反。",
    "lesson9-第九課-鳥-23": "題幹的「客夜」與「酸楚」表現人在異鄉夜晚聽聲而生出的思鄉之情，與(D)「不知何處吹蘆管，一夜征人盡望鄉」意境最接近。其他選項分別偏向孤獨感懷、傷春惆悵、英雄未竟之悲。",
    "lesson9-第九課-鳥-24": "詩句寫山川阻隔、分別後相會日長，又以「願為比翼鳥」表達離別後盼望相聚，因此屬於送別詩，故選(A)。它不是追懷古人古事、閨中怨情或單純描寫山水田園。",
    "lesson10-第十課-秋之味-17": "杜牧山行寫寒山、石徑、白雲、楓林與霜葉，尤其「霜葉紅於二月花」明顯描寫深秋楓林景色，故選(A)。仲春、孟夏、初冬都與詩中的霜葉、楓林意象不符。",
    "self3-自學選文三-演講-1": "「司空見慣」與「十室九空」的「空」都讀ㄎㄨㄥ，讀音相同，故選(D)。(A)「較量」讀ㄌㄧㄤˋ，「車載斗量」讀ㄌㄧㄤˊ；(B)「興師問罪」讀ㄒㄧㄥ，「興高采烈」讀ㄒㄧㄥˋ；(C)「天乾物燥」讀ㄍㄢ，「扭轉乾坤」讀ㄑㄧㄢˊ。",
}


def build_question(level_id, paper_label, question):
    question_id = f"{level_id}-{paper_label}-{question['number']}".replace(" ", "-")
    return {
        "id": question_id,
        "source": paper_label,
        "question": question["question"],
        "options": question["options"],
        "answer": question["answer"],
        "explanation": EXPLANATION_OVERRIDES.get(question_id) or question.get("explanation") or f"來源：{paper_label}，第 {question['number']} 題。"
    }


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")

    data = {
        "settings": {
            "title": "國文六關挑戰",
            "passingScore": 80,
        },
        "lessons": [],
    }
    report = []

    for level in LEVELS:
        questions = []
        paper_reports = []
        for paper in level["papers"]:
            path = ROOT / paper["file"]
            extracted = extract_multiple_choice(
                read_docx_lines(path),
                start=paper.get("start"),
                end=paper.get("end"),
                page=paper.get("page"),
                stop_section=paper.get("stop_section"),
            )
            questions.extend(build_question(level["id"], paper["label"], q) for q in extracted)
            paper_reports.append({
                "label": paper["label"],
                "expected": paper["end"] - paper["start"] + 1,
                "actual": len(extracted),
                "numbers": [q["number"] for q in extracted],
            })

        data["lessons"].append({
            "id": level["id"],
            "title": level["title"],
            "subtitle": level["subtitle"],
            "description": level["description"],
            "questions": questions,
        })
        report.append({
            "level": level["subtitle"],
            "total": len(questions),
            "papers": paper_reports,
        })

    OUT.write_text(
        "window.QUIZ_DATA = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
