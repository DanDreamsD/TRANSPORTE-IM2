"""Extract text (with headings, lists, tables, image refs) and media from a .docx.
Usage: python -I extract_docx.py <docx> <outdir>
"""
import sys, zipfile, re, os
import xml.etree.ElementTree as ET

W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
R = '{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
A = '{http://schemas.openxmlformats.org/drawingml/2006/main}'
M = '{http://schemas.openxmlformats.org/officeDocument/2006/math}'
REL = '{http://schemas.openxmlformats.org/package/2006/relationships}'

docx, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out, 'media'), exist_ok=True)
z = zipfile.ZipFile(docx)

rels = {}
for r in ET.fromstring(z.read('word/_rels/document.xml.rels')).iter(REL + 'Relationship'):
    rels[r.get('Id')] = r.get('Target')

styles = {}
for s in ET.fromstring(z.read('word/styles.xml')).iter(W + 'style'):
    n = s.find(W + 'name')
    styles[s.get(W + 'styleId')] = n.get(W + 'val') if n is not None else s.get(W + 'styleId')

fig_counter = [0]
media_map = []


def math_text(el):
    return ''.join(t.text or '' for t in el.iter(M + 't'))


def run_text(p):
    parts = []
    for el in p.iter():
        if el.tag == W + 't':
            parts.append(el.text or '')
        elif el.tag == W + 'tab':
            parts.append('\t')
        elif el.tag == W + 'br':
            parts.append('\n')
        elif el.tag == M + 'oMath':
            parts.append(' $' + math_text(el) + '$ ')
        elif el.tag == A + 'blip':
            rid = el.get(R + 'embed')
            tgt = rels.get(rid, '?')
            fig_counter[0] += 1
            name = f'img{fig_counter[0]:02d}_' + os.path.basename(tgt)
            try:
                data = z.read('word/' + tgt)
                open(os.path.join(out, 'media', name), 'wb').write(data)
            except KeyError:
                pass
            media_map.append((fig_counter[0], name))
            parts.append(f' [[IMAGE {fig_counter[0]}: media/{name}]] ')
    # math text nodes are also w:t? no, m:t. Avoid dup: oMath handled above; m:t not W t.
    return ''.join(parts)


def para(p):
    pPr = p.find(W + 'pPr')
    style = ''
    lvl = None
    if pPr is not None:
        ps = pPr.find(W + 'pStyle')
        if ps is not None:
            style = styles.get(ps.get(W + 'val'), ps.get(W + 'val'))
        numPr = pPr.find(W + 'numPr')
        if numPr is not None:
            il = numPr.find(W + 'ilvl')
            lvl = int(il.get(W + 'val')) if il is not None else 0
    txt = run_text(p).strip()
    if not txt:
        return ''
    m = re.match(r'heading (\d)', style, re.I)
    if m:
        return '#' * int(m.group(1)) + ' ' + txt
    if style.lower() == 'title':
        return '# TITLE: ' + txt
    if lvl is not None:
        return '  ' * lvl + '- ' + txt
    if style and style.lower() not in ('normal', 'body text', 'list paragraph'):
        return f'[{style}] ' + txt
    return txt


def table(tbl):
    rows = []
    for tr in tbl.findall(W + 'tr'):
        cells = []
        for tc in tr.findall(W + 'tc'):
            cells.append(' / '.join(filter(None, (run_text(p).strip() for p in tc.findall('.//' + W + 'p')))).replace('|', '\\|'))
        rows.append('| ' + ' | '.join(cells) + ' |')
    if rows:
        ncol = rows[0].count('|') - 1
        rows.insert(1, '|' + '---|' * ncol)
    return '\n'.join(rows)


body = ET.fromstring(z.read('word/document.xml')).find(W + 'body')
lines = []
for el in body:
    if el.tag == W + 'p':
        t = para(el)
        if t:
            lines.append(t)
    elif el.tag == W + 'tbl':
        lines.append('\n' + table(el) + '\n')

open(os.path.join(out, 'guia_texto.md'), 'w', encoding='utf-8').write('\n\n'.join(lines))
with open(os.path.join(out, 'media_index.txt'), 'w', encoding='utf-8') as f:
    for i, n in media_map:
        f.write(f'{i}\t{n}\n')
print('paragraphs', len(lines), 'images', len(media_map))
