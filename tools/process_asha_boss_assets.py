from pathlib import Path
from PIL import Image

SOURCE_DIR = Path(r"C:\Users\USER\Downloads\拳擊\阿沙")
DEST_DIR = Path(__file__).resolve().parents[1] / "assets" / "reactions" / "boss"

FILES = {
    "沙拳擊準備.png": "asha-boss-ready",
    "沙拳擊敗.png": "asha-boss-wrong",
    "沙拳擊成1.png": "asha-boss-correct-1",
    "沙拳擊成2.png": "asha-boss-correct-2",
    "沙拳擊成3.png": "asha-boss-correct-3",
    "沙拳擊成4.png": "asha-boss-correct-4",
    "沙拳擊成5.png": "asha-boss-correct-5",
    "沙拳擊成6.png": "asha-boss-correct-6",
    "沙拳擊成7.png": "asha-boss-correct-7",
    "沙拳擊成8.png": "asha-boss-correct-8",
    "沙拳擊成9.png": "asha-boss-correct-9",
    "沙拳擊成10.png": "asha-boss-correct-10",
}


def remove_green_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    for y in range(height):
      for x in range(width):
        r, g, b, a = pixels[x, y]
        green_gap = g - max(r, b)
        if g > 115 and green_gap > 38:
            pixels[x, y] = (r, g, b, 0)
        elif g > 95 and green_gap > 18:
            fade = max(0, min(1, (green_gap - 18) / 20))
            pixels[x, y] = (r, g, b, int(a * (1 - fade)))

    return rgba


def main() -> None:
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    for source_name, output_stem in FILES.items():
        source_path = SOURCE_DIR / source_name
        if not source_path.exists():
            raise FileNotFoundError(source_path)

        image = Image.open(source_path)
        source_output = DEST_DIR / f"{output_stem}-source.png"
        final_output = DEST_DIR / f"{output_stem}.png"

        image.save(source_output, optimize=True)
        remove_green_background(image).save(final_output, optimize=True)
        print(final_output.relative_to(DEST_DIR.parents[2]))


if __name__ == "__main__":
    main()
