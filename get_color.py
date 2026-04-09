from PIL import Image
import collections

img = Image.open('frontend/public/logotacoschinohd.png')
img = img.convert('RGB')
colors = img.getcolors(maxcolors=1000000)
# Filter out white-ish and black-ish colors
valid_colors = [c for c in colors if not (c[1][0] > 200 and c[1][1] > 200 and c[1][2] > 200) and not (c[1][0] < 50 and c[1][1] < 50 and c[1][2] < 50)]
valid_colors.sort(key=lambda x: x[0], reverse=True)
most_common = valid_colors[0][1]
print(f"#{most_common[0]:02x}{most_common[1]:02x}{most_common[2]:02x}")
