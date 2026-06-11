from pathlib import Path
from shutil import copy2

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]


ASSETS = [
    (r"C:\Users\USER\Downloads\籃球\阿沙籃球準備.png", "assets/reactions/basketball/asha-basketball-ready.png"),
    (r"C:\Users\USER\Downloads\籃球\阿沙籃球成功.png", "assets/reactions/basketball/asha-basketball-correct-v2.png"),
    (r"C:\Users\USER\Downloads\籃球\阿沙籃球成功.png", "assets/reactions/basketball/asha-basketball-correct.png"),
    (r"C:\Users\USER\Downloads\籃球\阿沙籃球失敗.png", "assets/reactions/basketball/asha-basketball-wrong.png"),
    (r"C:\Users\USER\Downloads\籃球\鹿醬籃球準備.png", "assets/reactions/basketball/lujiang-basketball-ready.png"),
    (r"C:\Users\USER\Downloads\籃球\鹿醬籃球成功.png", "assets/reactions/basketball/lujiang-basketball-correct.png"),
    (r"C:\Users\USER\Downloads\籃球\鹿醬籃球失敗.png", "assets/reactions/basketball/lujiang-basketball-wrong.png"),
    (r"C:\Users\USER\Downloads\棒球\阿沙棒球準備.png", "assets/reactions/baseball/asha-baseball-ready.png"),
    (r"C:\Users\USER\Downloads\棒球\阿沙棒球成功.png", "assets/reactions/baseball/asha-baseball-correct.png"),
    (r"C:\Users\USER\Downloads\棒球\阿沙棒球失敗.png", "assets/reactions/baseball/asha-baseball-wrong.png"),
    (r"C:\Users\USER\Downloads\棒球\鹿醬棒球準備.png", "assets/reactions/baseball/lujiang-baseball-ready.png"),
    (r"C:\Users\USER\Downloads\棒球\鹿醬棒球成功.png", "assets/reactions/baseball/lujiang-baseball-correct.png"),
    (r"C:\Users\USER\Downloads\棒球\鹿醬棒球失敗.png", "assets/reactions/baseball/lujiang-baseball-wrong.png"),
    (r"C:\Users\USER\Downloads\羽\阿沙羽球準備.png", "assets/reactions/badminton/asha-badminton-ready.png"),
    (r"C:\Users\USER\Downloads\羽\阿沙羽球成功.png", "assets/reactions/badminton/asha-badminton-correct.png"),
    (r"C:\Users\USER\Downloads\羽\阿沙羽球失敗.png", "assets/reactions/badminton/asha-badminton-wrong.png"),
    (r"C:\Users\USER\Downloads\羽\鹿醬羽球準備.png", "assets/reactions/badminton/lujiang-badminton-ready.png"),
    (r"C:\Users\USER\Downloads\羽\鹿醬羽球成功.png", "assets/reactions/badminton/lujiang-badminton-correct.png"),
    (r"C:\Users\USER\Downloads\羽\鹿醬羽球失敗.png", "assets/reactions/badminton/lujiang-badminton-wrong.png"),
    (r"C:\Users\USER\Downloads\排\阿沙排球準備.png", "assets/reactions/volleyball/asha-volleyball-ready.png"),
    (r"C:\Users\USER\Downloads\排\阿沙排球成功.png", "assets/reactions/volleyball/asha-volleyball-correct.png"),
    (r"C:\Users\USER\Downloads\排\阿沙排球失敗.png", "assets/reactions/volleyball/asha-volleyball-wrong.png"),
    (r"C:\Users\USER\Downloads\排\鹿醬排球準備.png", "assets/reactions/volleyball/lujiang-volleyball-ready.png"),
    (r"C:\Users\USER\Downloads\排\鹿醬排球成功.png", "assets/reactions/volleyball/lujiang-volleyball-correct.png"),
    (r"C:\Users\USER\Downloads\排\鹿醬排球失敗.png", "assets/reactions/volleyball/lujiang-volleyball-wrong.png"),
    (r"C:\Users\USER\Downloads\足\阿沙足球準備.png", "assets/reactions/soccer/asha-soccer-ready.png"),
    (r"C:\Users\USER\Downloads\足\阿沙足球成功.png", "assets/reactions/soccer/asha-soccer-correct.png"),
    (r"C:\Users\USER\Downloads\足\阿沙足球失敗.png", "assets/reactions/soccer/asha-soccer-wrong.png"),
    (r"C:\Users\USER\Downloads\足\鹿醬足球準備.png", "assets/reactions/soccer/lujiang-soccer-ready.png"),
    (r"C:\Users\USER\Downloads\足\鹿醬足球成功.png", "assets/reactions/soccer/lujiang-soccer-correct.png"),
    (r"C:\Users\USER\Downloads\足\鹿醬足球失敗.png", "assets/reactions/soccer/lujiang-soccer-wrong.png"),
]


def key_from_border(rgb):
    top = rgb[0, :, :]
    bottom = rgb[-1, :, :]
    left = rgb[:, 0, :]
    right = rgb[:, -1, :]
    border = np.concatenate([top, bottom, left, right], axis=0)
    greenish = border[(border[:, 1] > 120) & (border[:, 1] > border[:, 0] * 1.15) & (border[:, 1] > border[:, 2] * 1.15)]
    sample = greenish if len(greenish) else border
    return np.median(sample, axis=0).astype(np.float32)


def remove_green(input_path, output_path):
    image = Image.open(input_path).convert("RGBA")
    rgba = np.asarray(image).astype(np.float32)
    rgb = rgba[:, :, :3]
    alpha_original = rgba[:, :, 3]
    key = key_from_border(rgb)

    distance = np.linalg.norm(rgb - key, axis=2)
    transparent_threshold = 14.0
    opaque_threshold = 230.0
    alpha = np.clip((distance - transparent_threshold) / (opaque_threshold - transparent_threshold), 0, 1) * 255

    greenish = (rgb[:, :, 1] > 105) & (rgb[:, :, 1] > rgb[:, :, 0] * 1.12) & (rgb[:, :, 1] > rgb[:, :, 2] * 1.12)
    close_to_key = distance < 260
    alpha = np.where(greenish & close_to_key, np.minimum(alpha, np.clip((distance - 10) / 170, 0, 1) * 255), alpha)

    alpha_image = Image.fromarray(np.uint8(alpha)).filter(ImageFilter.GaussianBlur(0.35))
    alpha = np.asarray(alpha_image).astype(np.float32)

    # Despill bright green fringes on soft edges.
    edge = (alpha > 0) & (alpha < 245)
    rgb_out = rgb.copy()
    rgb_out[:, :, 1] = np.where(edge, np.minimum(rgb_out[:, :, 1], np.maximum(rgb_out[:, :, 0], rgb_out[:, :, 2]) * 1.06), rgb_out[:, :, 1])

    out = np.dstack([rgb_out, np.minimum(alpha, alpha_original)]).clip(0, 255).astype(np.uint8)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(out, mode="RGBA").save(output_path)

    source_path = output_path.with_name(f"{output_path.stem}-source.png")
    copy2(input_path, source_path)

    corners = [out[0, 0, 3], out[0, -1, 3], out[-1, 0, 3], out[-1, -1, 3]]
    visible = int((out[:, :, 3] > 8).sum())
    total = out.shape[0] * out.shape[1]
    return output_path, source_path, corners, visible, total


def main():
    for source, target in ASSETS:
        source_path = Path(source)
        if not source_path.exists():
            raise FileNotFoundError(source_path)
        output_path = ROOT / target
        output, source_copy, corners, visible, total = remove_green(source_path, output_path)
        print(f"{output.relative_to(ROOT)} visible={visible}/{total} corners={corners} source={source_copy.name}")


if __name__ == "__main__":
    main()
