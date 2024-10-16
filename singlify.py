import os

html_file = 'index.html'
js_file = 'script.js'
css_file = 'styles.css'
output_file = 'sifooma.html'

with open(html_file, 'r', encoding='utf-8') as file:
    html_content = file.read()
with open(js_file, 'r', encoding='utf-8') as file:
    js_content = file.read()
with open(css_file, 'r', encoding='utf-8') as file:
    css_content = file.read()

html_content = html_content.replace(f'<link rel="stylesheet" href="{css_file}">', '')
html_content = html_content.replace(f'<script src="{js_file}"></script>', '')

combined_content = html_content.replace(
    '</head>', f'<style>\n{css_content}\n</style>\n</head>').replace(
    '</body>', f'<script>\n{js_content}\n</script>\n</body>')

with open(output_file, 'w', encoding='utf-8') as file:
    file.write(combined_content)

print(f"Combined HTML, CSS, and JS have been written to {output_file}.")
