from pathlib import Path

from PIL import Image, ImageEnhance


SOURCE = Path("assets/campus-sports-map.png")
OUTPUT_DIR = Path("assets/level-bg")
OUTPUT_SIZE = (1600, 900)
RATIO = 16 / 9

SPECS = {
    "lesson7-basketball": (0.62, 0.63, 760),
    "lesson8-baseball": (0.42, 0.20, 760),
    "lesson9-badminton": (0.79, 0.50, 760),
    "lesson10-track": (0.48, 0.55, 900),
    "self3-volleyball": (0.20, 0.67, 760),
    "review-soccer": (0.35, 0.58, 820),
    "final-campus": (0.50, 0.50, 1672),
}


def crop_around(image, center_x, center_y, width):
    image_width, image_height = image.size
    height = round(width / RATIO)
    left = round(center_x * image_width - width / 2)
    top = round(center_y * image_height - height / 2)
    left = max(0, min(image_width - width, left))
    top = max(0, min(image_height - height, top))
    return image.crop((left, top, left + width, top + height))


def main():
    image = Image.open(SOURCE).convert("RGB")
    OUTPUT_DIR.mkdir(exist_ok=True)

    for name, (center_x, center_y, width) in SPECS.items():
        cropped = image if name == "final-campus" else crop_around(image, center_x, center_y, width)
        cropped = cropped.resize(OUTPUT_SIZE, Image.Resampling.LANCZOS)
        cropped = ImageEnhance.Color(cropped).enhance(1.08)
        cropped = ImageEnhance.Contrast(cropped).enhance(1.04)
        cropped.save(OUTPUT_DIR / f"{name}.jpg", quality=88, optimize=True)

    print(f"created {len(SPECS)} backgrounds")


if __name__ == "__main__":
    main()
