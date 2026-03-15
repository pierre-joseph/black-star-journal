import sys
import argparse
from pathlib import Path
from pypdf import PdfReader, PdfWriter
from pypdf.generic import RectangleObject

def split_double_pages(path_str, ratio_threshold=1.2, in_place=False):
    src = Path(path_str)
    if not src.exists():
        print(f"File not found: {src}")
        return

    out = src if in_place else src.with_name(f"{src.stem}.split{src.suffix}")
    tmp = out.with_suffix('.tmp.pdf')

    reader = PdfReader(src)
    writer = PdfWriter()

    split_count = 0

    for page in reader.pages:
        box = page.mediabox
        w = float(box.width)
        h = float(box.height)

        if h > 0 and (w / h) >= ratio_threshold:  # likely double-page spread
            mid = w / 2
            split_count += 1

            # Add two independent copies, then crop each one.
            writer.add_page(page)
            left = writer.pages[-1]
            left.mediabox = RectangleObject([box.left, box.bottom, box.left + mid, box.top])
            left.cropbox = RectangleObject([box.left, box.bottom, box.left + mid, box.top])

            writer.add_page(page)
            right = writer.pages[-1]
            right.mediabox = RectangleObject([box.left + mid, box.bottom, box.right, box.top])
            right.cropbox = RectangleObject([box.left + mid, box.bottom, box.right, box.top])
        else:
            writer.add_page(page)

    with open(tmp, 'wb') as f:
        writer.write(f)

    if in_place:
        src.unlink()
        tmp.rename(src)
        out_path = src
    else:
        out_path = out

    print(
        f"Done: {out_path} "
        f"({len(reader.pages)} pages -> {len(writer.pages)} pages, split pages: {split_count})"
    )

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split likely double-page PDF spreads into single pages.")
    parser.add_argument("pdf", help="Path to source PDF")
    parser.add_argument(
        "--ratio-threshold",
        type=float,
        default=1.2,
        help="Only split pages where width/height is >= this value (default: 1.2)",
    )
    parser.add_argument(
        "--in-place",
        action="store_true",
        help="Replace original file instead of writing <name>.split.pdf",
    )

    args = parser.parse_args()
    split_double_pages(args.pdf, ratio_threshold=args.ratio_threshold, in_place=args.in_place)