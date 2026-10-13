import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'docs/project-thumbnail-prompts.json').read_text(encoding='utf-8'))
size = (1536, 864)

for project in manifest['projects']:
    cover = Image.open(root / project['saved_generation']).convert('RGB').resize(size, Image.Resampling.LANCZOS)
    composition = project.get('composition')
    if composition:
        source = Image.open(root / project['source_images'][0]).convert('RGB')
        source = source.crop(composition['source_crop_pixels'])
        inset = composition['inset_normalized']
        x, y = round(inset['x'] * size[0]), round(inset['y'] * size[1])
        width, height = round(inset['width'] * size[0]), round(inset['height'] * size[1])
        if project['slug'] == 'jarvis':
            ImageDraw.Draw(cover).rectangle((round(size[0] * .40), 0, size[0], size[1]), fill='#191a1b')
        source = ImageOps.contain(source, (width, height), Image.Resampling.LANCZOS)
        x += (width - source.width) // 2
        y += (height - source.height) // 2
        if project['slug'] == 'handy':
            mask = Image.new('L', source.size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, source.width - 1, source.height - 1), radius=source.height // 2, fill=255)
            cover.paste(source, (x, y), mask)
        else:
            cover.paste(source, (x, y))
    output = root / project['final_asset']
    cover.save(output, 'WEBP', quality=88, method=6)
    print(f"{project['slug']}: {output.stat().st_size // 1024} KB")
