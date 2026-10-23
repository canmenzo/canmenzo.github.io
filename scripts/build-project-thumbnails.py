import json
from pathlib import Path

from PIL import Image


root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'docs/project-thumbnail-prompts.json').read_text(encoding='utf-8'))
size = (1536, 864)

for project in manifest['projects']:
    cover = Image.open(root / project['saved_generation']).convert('RGB').resize(size, Image.Resampling.LANCZOS)
    output = root / project['final_asset']
    cover.save(output, 'WEBP', quality=project['webp_quality'], method=6)
    print(f"{project['slug']}: {output.stat().st_size // 1024} KB")
