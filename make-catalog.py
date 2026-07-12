# -*- coding: utf-8 -*-
# Собирает PDF-каталог работ из обложек скриншотов
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SHOTS = "/Users/27/фриланс/screenshots"
OUT = "/Users/27/фриланс/Каталог работ.pdf"
SITE = "jonessssenator-art.github.io/portfolio"

W, H = 1240, 1754  # A4 @ 150dpi
BG = (13, 13, 18)
CARD = (26, 26, 36)
LINE = (38, 38, 51)
TXT = (244, 244, 247)
MUTED = (154, 154, 172)
ACC1 = (99, 102, 241)
ACC2 = (168, 85, 247)

F = "/System/Library/Fonts/Supplemental/"
def font(name, size):
    return ImageFont.truetype(F + name, size)

f_title  = font("Arial Bold.ttf", 88)
f_h2     = font("Arial Bold.ttf", 44)
f_name   = font("Arial Bold.ttf", 40)
f_tag    = font("Arial Bold.ttf", 22)
f_body   = font("Arial.ttf", 27)
f_small  = font("Arial.ttf", 24)
f_link   = font("Arial.ttf", 25)
f_num    = font("Arial Black.ttf", 30)
f_stat   = font("Arial Black.ttf", 64)

WORKS = [
    ("01-robotrek",         "РОБОТРЕК",          "Образование",  "Школа робототехники и программирования для детей 7–14 лет.", "landings/01-robotrek.html"),
    ("02-chistodom",        "ЧистоДом",          "Услуги",       "Клининговая компания: уборка квартир и офисов.", "landings/02-chistodom.html"),
    ("03-zerno",            "Зерно",             "HoReCa",       "Кофейня-пекарня со своей обжаркой.", "landings/03-zerno.html"),
    ("04-puls",             "Пульс",             "Фитнес",       "Фитнес и EMS-студия. Результат за 8 недель.", "landings/04-puls.html"),
    ("05-dental",           "Дентал Студия",     "Медицина",     "Стоматология: лечение, имплантация, отбеливание.", "landings/05-dental.html"),
    ("06-flowtask",         "Flowtask",          "SaaS",         "Облачный таск-менеджер для команд.", "landings/06-flowtask.html"),
    ("07-britva",           "Бритва",            "Бьюти",        "Барбершоп премиум-класса.", "landings/07-britva.html"),
    ("08-buketnaya",        "Букетная",          "Доставка",     "Доставка цветов за 2 часа с фото перед отправкой.", "landings/08-buketnaya.html"),
    ("09-glyanec",          "Глянец",            "Авто",         "Детейлинг-центр: керамика, полировка, химчистка.", "landings/09-glyanec.html"),
    ("10-sakura",           "Сакура",            "Доставка еды", "Доставка суши и роллов за 60 минут.", "landings/10-sakura.html"),
    ("11-logistic",         "ГрузПоРоссии",      "Логистика",    "Грузоперевозки по всей России от 7 ₽/км.", "landings/11-logistic/"),
    ("12-concept-detailing","Concept Detailing", "Детейлинг",    "Премиальный детейлинг-центр в Астрахани: керамика, оклейка, химчистка.", "landings/12-concept-detailing/"),
    ("13-time-brand",       "TIME BRAND",        "Часы",         "Магазин часов в Астрахани: каталог 129 моделей с ценами, квиз-подбор и бронь в 1 клик.", "landings/13-time-brand/"),
    ("14-suranova-pm",      "Мария Суранова",    "Бьюти",        "Перманентный макияж бровей, губ и век. Обучение мастеров. Вологда.", "landings/14-suranova-pm/"),
    ("15-gsnv-lab",         "GSNV-Lab",          "Бьюти",        "Сеть салонов красоты и барбершопов в Астрахани: 12 салонов, 4 бренда.", "landings/15-gsnv-lab/"),
]

def draw_grad_text(page, draw, xy, text, fnt, anchor="la", c1=ACC1, c2=ACC2):
    """Текст с горизонтальным градиентом: рисуем маску текста и заливаем градиентом"""
    x0, y0, x1, y1 = draw.textbbox(xy, text, font=fnt, anchor=anchor)
    w, h = x1 - x0, y1 - y0
    if w <= 0 or h <= 0:
        return
    pad = 8
    mask = Image.new("L", (w + 2 * pad, h + 2 * pad), 0)
    md = ImageDraw.Draw(mask)
    # рисуем тем же анкором со сдвигом так, чтобы bbox лёг в (pad, pad)
    md.text((xy[0] - x0 + pad, xy[1] - y0 + pad), text, font=fnt, anchor=anchor, fill=255)
    grad = Image.new("RGB", mask.size, 0)
    gd = ImageDraw.Draw(grad)
    for i in range(mask.size[0]):
        k = i / max(1, mask.size[0] - 1)
        col = tuple(int(a + (b - a) * k) for a, b in zip(c1, c2))
        gd.line([(i, 0), (i, mask.size[1])], fill=col)
    page.paste(grad, (x0 - pad, y0 - pad), mask)

def rounded(im, rad):
    m = Image.new("L", im.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, im.size[0]-1, im.size[1]-1], rad, fill=255)
    im.putalpha(m)
    return im

def glow_page():
    page = Image.new("RGB", (W, H), BG)
    glow = Image.new("RGB", (W // 4, H // 4), BG)
    gd = ImageDraw.Draw(glow)
    gd.ellipse([W//8 - 130, -90, W//8 + 130, 70], fill=(28, 26, 52))
    glow = glow.resize((W, H)).filter(ImageFilter.GaussianBlur(60))
    return Image.blend(page, glow, 0.85)

def cover_page():
    page = glow_page()
    d = ImageDraw.Draw(page)
    cx = W // 2
    # логотип: градиентный скруглённый квадрат с </>
    ls = 120
    logo = Image.new("RGB", (ls, ls))
    ld = ImageDraw.Draw(logo)
    for i in range(ls):
        k = i / (ls - 1)
        col = tuple(int(a + (b - a) * k) for a, b in zip(ACC1, ACC2))
        ld.line([(i, 0), (i, ls)], fill=col)
    ld.text((ls // 2, ls // 2), "</>", font=font("Arial Bold.ttf", 44), anchor="mm", fill=(255, 255, 255))
    logo = rounded(logo.convert("RGBA"), 30)
    page.paste(logo, (cx - ls // 2, 260), logo)
    d.text((cx, 470), "Каталог работ", font=f_title, anchor="mm", fill=TXT)
    draw_grad_text(page, d, (cx, 585), "Лендинги, которые продают", f_h2, anchor="mm")
    d.text((cx, 700), "Современная адаптивная вёрстка под ключ.", font=f_body, anchor="mm", fill=MUTED)
    d.text((cx, 745), "Каждая работа — живая страница: откройте по ссылке.", font=f_body, anchor="mm", fill=MUTED)

    stats = [("14", "проектов"), ("100%", "адаптив"), ("HTML/CSS/JS", "чистый код")]
    y = 950
    xs = [cx - 380, cx, cx + 380]
    for (v, lbl), x in zip(stats, xs):
        fnt = f_stat if len(v) <= 5 else font("Arial Black.ttf", 40)
        draw_grad_text(page, d, (x, y), v, fnt, anchor="mm")
        d.text((x, y + 70), lbl, font=f_small, anchor="mm", fill=MUTED)

    # плашка со ссылкой на сайт
    bw, bh = 780, 110
    bx, by = cx - bw // 2, 1300
    d.rounded_rectangle([bx, by, bx + bw, by + bh], 26, fill=CARD, outline=LINE, width=2)
    d.text((cx, by + 36), "Всё портфолио онлайн:", font=f_small, anchor="mm", fill=MUTED)
    d.text((cx, by + 76), SITE, font=font("Arial Bold.ttf", 30), anchor="mm", fill=(140, 143, 255))

    d.text((cx, H - 90), "© 2026 · Портфолио лендингов", font=f_small, anchor="mm", fill=MUTED)
    return page

def work_block(page, d, y, idx, slug, name, tag, desc, path):
    """Карточка работы: обложка сверху, текст снизу"""
    mx = 90
    cw = W - mx * 2
    img_h = 540
    block_h = img_h + 190
    # карточка
    d.rounded_rectangle([mx, y, mx + cw, y + block_h], 28, fill=CARD, outline=LINE, width=2)
    # обложка: кроп до нужного соотношения
    im = Image.open(f"{SHOTS}/{slug}-cover.png").convert("RGB")
    ratio = cw / img_h
    iw, ih = im.size
    if iw / ih > ratio:
        nw = int(ih * ratio)
        im = im.crop(((iw - nw) // 2, 0, (iw + nw) // 2, ih))
    else:
        nh = int(iw / ratio)
        im = im.crop((0, 0, iw, nh))  # берём верх страницы
    im = im.resize((cw - 8, img_h), Image.LANCZOS).convert("RGBA")
    im = rounded(im, 24)
    page.paste(im, (mx + 4, y + 4), im)
    # тег
    tb = d.textbbox((0, 0), tag.upper(), font=f_tag)
    tw = tb[2] - tb[0]
    tx = mx + cw - tw - 60
    d.rounded_rectangle([tx, y + 24, tx + tw + 36, y + 72], 24, fill=(13, 13, 18))
    d.text((tx + 18, y + 48), tag.upper(), font=f_tag, anchor="lm", fill=TXT)
    # текст: градиентный номер + название
    ty = y + img_h + 40
    num = f"{idx:02d}"
    draw_grad_text(page, d, (mx + 40, ty), num, f_name, anchor="lm")
    nb = d.textbbox((mx + 40, ty), num, font=f_name, anchor="lm")
    d.text((nb[2] + 22, ty), name, font=f_name, anchor="lm", fill=TXT)
    d.text((mx + 40, ty + 62), desc, font=f_body, anchor="lm", fill=MUTED)
    d.text((mx + 40, ty + 112), f"→ {SITE}/{path}", font=f_link, anchor="lm", fill=(140, 143, 255))
    return block_h

def works_pages():
    pages = []
    per = 2
    for p in range(0, len(WORKS), per):
        page = Image.new("RGB", (W, H), BG)
        d = ImageDraw.Draw(page)
        y = 70
        for j, (slug, name, tag, desc, path) in enumerate(WORKS[p:p + per]):
            idx = p + j + 1
            bh = work_block(page, d, y, idx, slug, name, tag, desc, path)
            y += bh + 60
        # футер
        d.text((W // 2, H - 55), f"{SITE}  ·  стр. {p // per + 2} из {len(WORKS) // per + 1}",
               font=f_small, anchor="mm", fill=MUTED)
        pages.append(page)
    return pages

pages = [cover_page()] + works_pages()
pages[0].save(OUT, save_all=True, append_images=pages[1:], resolution=150.0)
print("OK:", OUT, f"({len(pages)} стр.)")
